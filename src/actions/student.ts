'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import type { Student, StudentViolation } from "@prisma/client"
import { triggerElearningSync } from "@/actions/elearning-sync"

function autoCorrectStudentNisAndName(nisInput: string, nameInput: string) {
    let nis = nisInput.trim()
    let name = nameInput.trim()

    const nisHasLetters = /[a-zA-Z]/.test(nis)
    const nameIsOnlyDigits = /^\d+$/.test(name)
    const nameHasLetters = /[a-zA-Z]/.test(name)

    if (nisHasLetters && (!nameHasLetters || nameIsOnlyDigits)) {
        const temp = nis
        nis = name
        name = temp
    }

    return { nis, name }
}

const StudentSchema = z.object({
    nis: z.string().min(1, "NIS wajib diisi"),
    name: z.string().min(1, "Nama wajib diisi"),
    class: z.string().min(1, "Kelas wajib diisi"),
})

// Public: get all students with violation point totals
export async function getStudents(query?: string, statusFilter?: string) {
    try {
        const statusCondition = statusFilter === 'SEMUA' ? {} : { status: statusFilter ?? 'AKTIF' }

        const where = query
            ? {
                  ...statusCondition,
                  OR: [
                      { name: { contains: query, mode: 'insensitive' as const } },
                      { nis: { contains: query, mode: 'insensitive' as const } },
                      { class: { contains: query, mode: 'insensitive' as const } },
                  ],
              }
            : statusCondition

        const students = await prisma.student.findMany({
            where,
            orderBy: [{ class: 'asc' }, { name: 'asc' }],
            include: {
                violations: {
                    select: { points: true },
                },
            },
        })

        return students.map((s: Student & { violations: Pick<StudentViolation, 'points'>[] }) => ({
            ...s,
            totalPoints: s.violations.reduce((sum: number, v: Pick<StudentViolation, 'points'>) => sum + v.points, 0),
        }))
    } catch (error) {
        console.error("Error fetching students:", error)
        return []
    }
}

// Admin: get single student (for editing)
export async function getStudentById(id: number) {
    try {
        return await prisma.student.findUnique({ where: { id } })
    } catch (error) {
        console.error("Error fetching student:", error)
        return null
    }
}

// Admin only: create student
export async function createStudent(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized: Hanya Admin yang dapat menambah data siswa." }
    }

    const rawNis = (formData.get('nis') as string || '').trim()
    const rawName = (formData.get('name') as string || '').trim()
    const { nis, name } = autoCorrectStudentNisAndName(rawNis, rawName)

    const validated = StudentSchema.safeParse({
        nis,
        name,
        class: formData.get('class'),
    })

    if (!validated.success) {
        return {
            error: "Validasi gagal. Periksa kembali input Anda.",
            fieldErrors: validated.error.flatten().fieldErrors,
        }
    }

    try {
        await prisma.student.create({ data: validated.data })
        revalidatePath('/dashboard/students')
        revalidatePath('/pelanggaran')
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return { error: "NIS sudah terdaftar. Gunakan NIS yang berbeda." }
        }
        console.error("Failed to create student:", error)
        return { error: "Gagal menyimpan data siswa." }
    }

    redirect('/dashboard/students')
}

// Admin only: update student
export async function updateStudent(id: number, prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized: Hanya Admin yang dapat mengubah data siswa." }
    }

    const rawNis = (formData.get('nis') as string || '').trim()
    const rawName = (formData.get('name') as string || '').trim()
    const { nis, name } = autoCorrectStudentNisAndName(rawNis, rawName)

    const validated = StudentSchema.safeParse({
        nis,
        name,
        class: formData.get('class'),
    })

    if (!validated.success) {
        return {
            error: "Validasi gagal.",
            fieldErrors: validated.error.flatten().fieldErrors,
        }
    }

    try {
        await prisma.student.update({ where: { id }, data: validated.data })
        revalidatePath('/dashboard/students')
        revalidatePath('/pelanggaran')
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return { error: "NIS sudah digunakan siswa lain." }
        }
        return { error: "Gagal memperbarui data siswa." }
    }

    redirect('/dashboard/students')
}

// Admin only: delete student
export async function deleteStudent(id: number) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized." }
    }

    try {
        await prisma.student.delete({ where: { id } })
        revalidatePath('/dashboard/students')
        revalidatePath('/pelanggaran')
        return { success: true }
    } catch (error) {
        console.error("Failed to delete student:", error)
        return { error: "Gagal menghapus data siswa." }
    }
}

// Admin only: bulk import/upsert students
export async function importStudents(students: { nis: string, name: string, class: string }[]) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized: Hanya Admin yang dapat mengimpor data siswa." }
    }

    if (!Array.isArray(students) || students.length === 0) {
        return { error: "Data siswa kosong atau format tidak valid." }
    }

    // Validate each student
    const validStudents: { nis: string, name: string, class: string }[] = []
    const errors: string[] = []

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const rowNum = i + 1;
        const rawNis = student.nis?.toString().trim();
        const rawName = student.name?.toString().trim();
        const className = student.class?.toString().trim();

        if (!rawNis || !rawName || !className) {
            errors.push(`Baris ${rowNum}: NIS, Nama, dan Kelas wajib diisi.`);
            continue;
        }

        const { nis, name } = autoCorrectStudentNisAndName(rawNis, rawName);

        validStudents.push({ nis, name, class: className });
    }

    if (errors.length > 0 && validStudents.length === 0) {
        return { error: "Semua baris tidak valid.", details: errors }
    }

    try {
        let createdCount = 0;
        let updatedCount = 0;

        // Perform upserts
        for (const s of validStudents) {
            const existing = await prisma.student.findUnique({
                where: { nis: s.nis }
            })

            if (existing) {
                await prisma.student.update({
                    where: { nis: s.nis },
                    data: {
                        name: s.name,
                        class: s.class
                    }
                })
                updatedCount++;
            } else {
                await prisma.student.create({
                    data: {
                        nis: s.nis,
                        name: s.name,
                        class: s.class
                    }
                })
                createdCount++;
            }
        }

        revalidatePath('/dashboard/students')
        revalidatePath('/pelanggaran')

        return {
            success: true,
            message: `Berhasil memproses ${validStudents.length} siswa. (${createdCount} baru, ${updatedCount} diperbarui).`,
            details: errors.length > 0 ? errors : undefined
        }
    } catch (error) {
        console.error("Error importing students:", error)
        return { error: "Gagal menyimpan data impor siswa." }
    }
}

// Admin only: transfer student to another class manually
export async function transferStudentClass(studentId: number, newClass: string, notes?: string) {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized." }
    }
    if (!newClass || newClass.trim() === '') {
        return { error: "Kelas tujuan wajib diisi." }
    }

    try {
        await prisma.student.update({
            where: { id: studentId },
            data: { class: newClass.trim() }
        })
        revalidatePath('/dashboard/students')
        revalidatePath('/pelanggaran')
        return { success: true, message: `Siswa berhasil dipindahkan ke kelas ${newClass}${notes ? ` (${notes})` : ''}.` }
    } catch (error) {
        console.error("Failed to transfer student class:", error)
        return { error: "Gagal memindahkan kelas siswa." }
    }
}

// Admin only: update student status (AKTIF, KELUAR)
export async function updateStudentStatus(studentId: number, status: 'AKTIF' | 'KELUAR') {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized." }
    }

    try {
        await prisma.student.update({
            where: { id: studentId },
            data: { status }
        })
        revalidatePath('/dashboard/students')
        return { success: true }
    } catch (error) {
        console.error("Failed to update student status:", error)
        return { error: "Gagal mengubah status siswa." }
    }
}

// Get student class history
export async function getStudentClassHistory(studentId: number) {
    try {
        return await prisma.studentClassHistory.findMany({
            where: { studentId },
            include: { academicYear: true },
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error("Error fetching student class history:", error)
        return []
    }
}

// Admin only: Perbaiki/tukar data NIS dan Nama siswa yang terbalik di database
export async function fixSwappedStudentNisAndName() {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
        return { error: "Unauthorized: Hanya Admin yang dapat memperbaiki data siswa." }
    }

    try {
        const allStudents = await prisma.student.findMany({
            select: { id: true, nis: true, name: true }
        })

        const swapped = allStudents.filter((s: { id: number; nis: string; name: string }) => {
            const nisHasLetters = /[a-zA-Z]/.test(s.nis)
            const nameIsOnlyDigits = /^\d+$/.test(s.name.trim())
            const nameHasLetters = /[a-zA-Z]/.test(s.name)
            return nisHasLetters || (nameIsOnlyDigits && !nameHasLetters)
        })

        if (swapped.length === 0) {
            return { success: true, message: "Tidak ada data siswa yang terbalik antara NIS dan Nama." }
        }

        let totalSwapped = 0
        let skippedCount = 0

        // Phase 1: Ubah NIS semua data terbalik ke NIS sementara (temp) untuk membebaskan unique constraint
        const targets: { id: number; finalNis: string; finalName: string }[] = []
        for (const s of swapped) {
            const finalNis = s.name.trim()
            const finalName = s.nis.trim()
            const tempNis = `__TEMP_SWAP_${s.id}_${Date.now()}__`

            try {
                await prisma.student.update({
                    where: { id: s.id },
                    data: {
                        nis: tempNis,
                        name: finalName
                    }
                })
                targets.push({ id: s.id, finalNis, finalName })
            } catch (err) {
                console.error(`Failed temp swap for student ${s.id}:`, err)
            }
        }

        // Phase 2: Tetapkan nilai NIS akhir yang sudah benar
        for (const t of targets) {
            const existing = await prisma.student.findFirst({
                where: {
                    nis: t.finalNis,
                    NOT: { id: t.id }
                }
            })

            if (existing) {
                const safeNis = `${t.finalNis}_DUP_${t.id}`
                await prisma.student.update({
                    where: { id: t.id },
                    data: { nis: safeNis }
                })
                skippedCount++
            } else {
                await prisma.student.update({
                    where: { id: t.id },
                    data: { nis: t.finalNis }
                })
                totalSwapped++
            }
        }

        let syncMsg = ""
        try {
            const syncRes = await triggerElearningSync()
            if (syncRes.success) {
                syncMsg = " Data juga telah disinkronkan ke E-Learning."
            }
        } catch (syncErr) {
            console.error("Auto sync to elearning failed:", syncErr)
        }

        revalidatePath('/dashboard/students')
        revalidatePath('/dashboard/students/promote')
        revalidatePath('/pelanggaran')

        let msg = `Berhasil memperbaiki ${totalSwapped} data siswa yang terbalik!`
        if (skippedCount > 0) {
            msg += ` (${skippedCount} data disesuaikan NIS-nya karena ada bentrokan NIS duplikat).`
        }
        msg += syncMsg

        return { success: true, message: msg }
    } catch (error: any) {
        console.error("Failed to fix swapped student NIS and Name:", error)
        return { error: error.message || "Gagal memperbaiki data siswa." }
    }
}
