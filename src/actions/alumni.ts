'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/auth"

const AlumniSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    graduationYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    currentStatus: z.string().optional(),
    institution: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Email tidak valid").optional().or(z.literal("")),
    image: z.string().optional(),
    isVerified: z.boolean().default(false),
})

export async function getAlumni(params?: { verifiedOnly?: boolean }) {
    try {
        const where = params?.verifiedOnly ? { isVerified: true } : {}
        return await prisma.alumni.findMany({
            where,
            orderBy: { graduationYear: 'desc' }
        })
    } catch (error) {
        console.error("Failed to fetch alumni", error)
        return []
    }
}

export async function getAlumniById(id: number) {
    return await prisma.alumni.findUnique({ where: { id } })
}

export async function createAlumni(prevState: any, formData: FormData) {
    // This action can be called publicly (registration) or private (admin)
    const session = await auth()
    const isAdmin = !!session

    const rawData = {
        name: formData.get("name")?.toString() || "",
        graduationYear: formData.get("graduationYear"),
        currentStatus: formData.get("currentStatus")?.toString() || "",
        institution: formData.get("institution")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        image: formData.get("image")?.toString() || undefined,
        isVerified: isAdmin ? (formData.get("isVerified") === "on") : false, // Public submission is always unverified
    }

    const validated = AlumniSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.alumni.create({
            data: validated.data
        })

        if (!isAdmin) {
            return { success: true, message: "Pendaftaran berhasil! Data Anda akan direview oleh admin." }
        }

    } catch (error) {
        return { error: "Gagal menyimpan data alumni" }
    }

    if (isAdmin) {
        revalidatePath("/dashboard/alumni")
        redirect("/dashboard/alumni")
    }

    return { success: true }
}

export async function updateAlumni(id: number, prevState: any, formData: FormData) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const rawData = {
        name: formData.get("name")?.toString() || "",
        graduationYear: formData.get("graduationYear"),
        currentStatus: formData.get("currentStatus")?.toString() || "",
        institution: formData.get("institution")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        image: formData.get("image")?.toString() || undefined,
        isVerified: formData.get("isVerified") === "on",
    }

    const validated = AlumniSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.alumni.update({
            where: { id },
            data: validated.data
        })
    } catch (error) {
        return { error: "Gagal update data alumni" }
    }

    revalidatePath("/dashboard/alumni")
    revalidatePath("/alumni")
    redirect("/dashboard/alumni")
}

export async function deleteAlumni(id: number) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    try {
        await prisma.alumni.delete({ where: { id } })
        revalidatePath("/dashboard/alumni")
        revalidatePath("/alumni")
        return { success: true }
    } catch (error) {
        return { error: "Gagal hapus data" }
    }
}

export async function toggleAlumniVerification(id: number, currentStatus: boolean) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    try {
        await prisma.alumni.update({
            where: { id },
            data: { isVerified: !currentStatus }
        })
        revalidatePath("/dashboard/alumni")
        revalidatePath("/alumni")
        return { success: true }
    } catch (error) {
        return { error: "Gagal update status" }
    }
}
