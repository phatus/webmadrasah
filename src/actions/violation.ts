'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { z } from "zod"

const COOKIE_NAME = "violation_access"
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

const ViolationSchema = z.object({
    studentId: z.coerce.number().int().positive("ID siswa tidak valid"),
    violationDate: z.string().min(1, "Tanggal wajib diisi"),
    description: z.string().min(3, "Deskripsi pelanggaran wajib diisi (min. 3 karakter)"),
    penalty: z.string().optional(),
    points: z.coerce.number().int().min(1, "Poin minimal 1").max(100, "Poin maksimal 100"),
    reporterName: z.string().min(2, "Nama guru pelapor wajib diisi"),
})

// Verify teacher access key and set cookie
export async function verifyAccessKey(formData: FormData) {
    const key = formData.get('accessKey') as string
    
    // Get expected key from DB, fallback to env or default
    const dbKeySetting = await prisma.appSetting.findUnique({
        where: { key: 'teacher_access_key' }
    })
    const expectedKey = dbKeySetting?.value || process.env.VIOLATION_ACCESS_KEY || "gurumadrasah123"

    if (!key || key !== expectedKey) {
        return { error: "Kode akses salah. Silakan coba lagi." }
    }

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, "1", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
    })

    return { success: true }
}

// Check if teacher mode is active via cookie
export async function isTeacherMode(): Promise<boolean> {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_NAME)?.value === "1"
}

// Logout from teacher mode
export async function logoutTeacherMode() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
    redirect('/pelanggaran')
}

// Public: get student detail with full violation history
export async function getStudentWithViolations(studentId: number) {
    try {
        return await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                violations: {
                    orderBy: { violationDate: 'desc' },
                },
            },
        })
    } catch (error) {
        console.error("Error fetching student violations:", error)
        return null
    }
}

// Teacher only (cookie-protected): create violation record
export async function createViolation(prevState: any, formData: FormData) {
    const cookieStore = await cookies()
    if (cookieStore.get(COOKIE_NAME)?.value !== "1") {
        return { error: "Akses ditolak. Masukkan kode akses guru terlebih dahulu." }
    }

    const validated = ViolationSchema.safeParse({
        studentId: formData.get('studentId'),
        violationDate: formData.get('violationDate'),
        description: formData.get('description'),
        penalty: formData.get('penalty') || undefined,
        points: formData.get('points'),
        reporterName: formData.get('reporterName'),
    })

    if (!validated.success) {
        return {
            error: "Validasi gagal. Periksa kembali input Anda.",
            fieldErrors: validated.error.flatten().fieldErrors,
        }
    }

    const { studentId, violationDate, ...rest } = validated.data

    try {
        await prisma.studentViolation.create({
            data: {
                studentId,
                violationDate: new Date(violationDate),
                ...rest,
            },
        })
        revalidatePath(`/pelanggaran/${studentId}`)
        revalidatePath('/pelanggaran')
    } catch (error) {
        console.error("Failed to create violation:", error)
        return { error: "Gagal menyimpan catatan pelanggaran." }
    }

    redirect(`/pelanggaran/${studentId}`)
}

// Teacher only (cookie-protected): delete violation record
export async function deleteViolation(id: number, studentId: number) {
    const cookieStore = await cookies()
    if (cookieStore.get(COOKIE_NAME)?.value !== "1") {
        return { error: "Akses ditolak." }
    }

    try {
        await prisma.studentViolation.delete({ where: { id } })
        revalidatePath(`/pelanggaran/${studentId}`)
        revalidatePath('/pelanggaran')
        return { success: true }
    } catch (error) {
        console.error("Failed to delete violation:", error)
        return { error: "Gagal menghapus catatan pelanggaran." }
    }
}
