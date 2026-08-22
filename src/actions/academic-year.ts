'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const AcademicYearSchema = z.object({
    name: z.string().min(1, "Nama tahun pelajaran wajib diisi"),
    startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
    endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
})

export async function getAcademicYears() {
    try {
        return await prisma.academicYear.findMany({
            orderBy: { name: 'desc' },
            include: {
                _count: { select: { classHistory: true } },
            },
        })
    } catch (error) {
        console.error("Error fetching academic years:", error)
        return []
    }
}

export async function getActiveAcademicYear() {
    try {
        return await prisma.academicYear.findFirst({
            where: { isActive: true },
        })
    } catch (error) {
        console.error("Error fetching active academic year:", error)
        return null
    }
}

export type CreateAcademicYearState = {
    error?: string
    fieldErrors?: Record<string, string[]>
    success?: boolean
    message?: string
}

export async function createAcademicYear(prevState: CreateAcademicYearState | unknown, formData: FormData): Promise<CreateAcademicYearState> {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized: Hanya Admin yang dapat mengelola tahun pelajaran." }
    }

    const validated = AcademicYearSchema.safeParse({
        name: formData.get('name'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
    })

    if (!validated.success) {
        return {
            error: "Validasi gagal.",
            fieldErrors: validated.error.flatten().fieldErrors,
        }
    }

    try {
        await prisma.academicYear.create({
            data: {
                name: validated.data.name,
                startDate: new Date(validated.data.startDate),
                endDate: new Date(validated.data.endDate),
                isActive: false,
            }
        })
        revalidatePath('/dashboard/students/academic-years')
        return { success: true, message: "Tahun pelajaran berhasil ditambahkan." }
    } catch (error: unknown) {
        if ((error as { code?: string })?.code === 'P2002') {
            return { error: "Tahun pelajaran dengan nama tersebut sudah ada." }
        }
        console.error("Failed to create academic year:", error)
        return { error: "Gagal menyimpan tahun pelajaran." }
    }
}

export async function setActiveAcademicYear(id: number) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized." }
    }

    try {
        await prisma.$transaction([
            prisma.academicYear.updateMany({ data: { isActive: false } }),
            prisma.academicYear.update({ where: { id }, data: { isActive: true } }),
        ])
        revalidatePath('/dashboard/students/academic-years')
        return { success: true }
    } catch (error) {
        console.error("Failed to set active academic year:", error)
        return { error: "Gagal mengubah tahun pelajaran aktif." }
    }
}

export async function deleteAcademicYear(id: number) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized." }
    }

    try {
        const year = await prisma.academicYear.findUnique({
            where: { id },
            include: { _count: { select: { classHistory: true } } }
        })
        if (!year) return { error: "Tahun pelajaran tidak ditemukan." }
        if (year.isActive) return { error: "Tidak dapat menghapus tahun pelajaran yang sedang aktif." }
        if (year._count.classHistory > 0) return { error: "Tidak dapat menghapus tahun pelajaran yang sudah memiliki riwayat kelas." }

        await prisma.academicYear.delete({ where: { id } })
        revalidatePath('/dashboard/students/academic-years')
        return { success: true }
    } catch (error) {
        console.error("Failed to delete academic year:", error)
        return { error: "Gagal menghapus tahun pelajaran." }
    }
}

function isClassGraduating(cls: string): boolean {
    if (!cls) return false
    const trimmed = cls.trim().toUpperCase()
    return trimmed.startsWith('9') || trimmed.startsWith('IX') || trimmed.includes('9') || trimmed.includes('IX')
}

export async function getPromotePreview(classMapping: Record<string, string>) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized.", data: [] }
    }

    try {
        const students = await prisma.student.findMany({
            where: { status: 'AKTIF' },
            orderBy: [{ class: 'asc' }, { name: 'asc' }],
        })

        const preview = students.map((s: { id: number; nis: string; name: string; class: string }) => {
            const isGraduating = isClassGraduating(s.class)
            const newClass = classMapping[s.class]
            return {
                id: s.id,
                nis: s.nis,
                name: s.name,
                currentClass: s.class,
                newClass: isGraduating ? 'ALUMNI' : (newClass ?? ''),
                action: isGraduating ? 'LULUS' : (newClass ? 'NAIK' : 'PERLU_KONFIGURASI'),
            }
        })

        return { data: preview }
    } catch (error) {
        console.error("Error getting promote preview:", error)
        return { error: "Gagal mengambil data preview.", data: [] }
    }
}

export async function promoteStudents(
    academicYearId: number,
    classMapping: Record<string, string>,
    exceptions: Record<number, 'TIDAK_NAIK' | 'KELUAR'>
) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized: Hanya Admin yang dapat memproses kenaikan kelas." }
    }

    try {
        const academicYear = await prisma.academicYear.findUnique({ where: { id: academicYearId } })
        if (!academicYear) return { error: "Tahun pelajaran tidak ditemukan." }

        const students = await prisma.student.findMany({
            where: { status: 'AKTIF' },
            orderBy: { name: 'asc' },
        })

        let promoted = 0
        let graduated = 0
        let exceptional = 0
        let skipped = 0

        for (const student of students) {
            const exceptionStatus = exceptions[student.id]
            const isGraduating = isClassGraduating(student.class)

            if (exceptionStatus) {
                await prisma.$transaction([
                    prisma.studentClassHistory.create({
                        data: {
                            studentId: student.id,
                            academicYearId,
                            class: student.class,
                            status: exceptionStatus,
                        }
                    }),
                    prisma.student.update({
                        where: { id: student.id },
                        data: {
                            status: exceptionStatus === 'KELUAR' ? 'KELUAR' : 'AKTIF',
                        }
                    }),
                ])
                exceptional++
            } else if (isGraduating) {
                const graduationYear = new Date().getFullYear()
                await prisma.$transaction([
                    prisma.studentClassHistory.create({
                        data: {
                            studentId: student.id,
                            academicYearId,
                            class: student.class,
                            status: 'LULUS',
                        }
                    }),
                    prisma.studentViolation.deleteMany({
                        where: { studentId: student.id }
                    }),
                    prisma.alumni.create({
                        data: {
                            name: student.name,
                            graduationYear,
                            isVerified: false,
                        }
                    }),
                    prisma.student.update({
                        where: { id: student.id },
                        data: { status: 'LULUS' }
                    }),
                ])
                graduated++
            } else {
                const newClass = classMapping[student.class]
                if (!newClass) {
                    skipped++
                    continue
                }
                await prisma.$transaction([
                    prisma.studentClassHistory.create({
                        data: {
                            studentId: student.id,
                            academicYearId,
                            class: student.class,
                            status: 'AKTIF',
                        }
                    }),
                    prisma.studentViolation.deleteMany({
                        where: { studentId: student.id }
                    }),
                    prisma.student.update({
                        where: { id: student.id },
                        data: { class: newClass }
                    }),
                ])
                promoted++
            }
        }

        revalidatePath('/dashboard/students')
        revalidatePath('/dashboard/students/promote')
        revalidatePath('/pelanggaran')

        return {
            success: true,
            message: `Proses selesai: ${promoted} naik kelas, ${graduated} lulus/alumni, ${exceptional} exception, ${skipped} dilewati.`,
            stats: { promoted, graduated, exceptional, skipped }
        }
    } catch (error) {
        console.error("Failed to promote students:", error)
        return { error: "Gagal memproses kenaikan kelas. Silakan coba lagi." }
    }
}
