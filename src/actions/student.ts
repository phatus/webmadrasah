'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const StudentSchema = z.object({
    nis: z.string().min(1, "NIS wajib diisi"),
    name: z.string().min(1, "Nama wajib diisi"),
    class: z.string().min(1, "Kelas wajib diisi"),
})

// Public: get all students with violation point totals
export async function getStudents(query?: string) {
    try {
        const where = query
            ? {
                  OR: [
                      { name: { contains: query, mode: 'insensitive' as const } },
                      { nis: { contains: query, mode: 'insensitive' as const } },
                      { class: { contains: query, mode: 'insensitive' as const } },
                  ],
              }
            : {}

        const students = await prisma.student.findMany({
            where,
            orderBy: { name: 'asc' },
            include: {
                violations: {
                    select: { points: true },
                },
            },
        })

        return students.map((s) => ({
            ...s,
            totalPoints: s.violations.reduce((sum, v) => sum + v.points, 0),
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

    const validated = StudentSchema.safeParse({
        nis: formData.get('nis'),
        name: formData.get('name'),
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

    const validated = StudentSchema.safeParse({
        nis: formData.get('nis'),
        name: formData.get('name'),
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
        const nis = student.nis?.toString().trim();
        const name = student.name?.toString().trim();
        const className = student.class?.toString().trim();

        if (!nis || !name || !className) {
            errors.push(`Baris ${rowNum}: NIS, Nama, dan Kelas wajib diisi.`);
            continue;
        }

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
