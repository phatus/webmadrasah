'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/auth"

const AnnouncementSchema = z.object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    content: z.string().optional(),
    type: z.enum(["INFO", "POPUP", "RUNNING_TEXT"]),
    isActive: z.boolean().default(true),
    expiresAt: z.string().optional().transform((val) => val ? new Date(val) : null),
})

export async function getAnnouncements() {
    try {
        return await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error("Failed to fetch announcements", error)
        return []
    }
}

export async function getActiveAnnouncements() {
    try {
        const now = new Date()
        return await prisma.announcement.findMany({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: now } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        return []
    }
}

export async function getAnnouncement(id: number) {
    return await prisma.announcement.findUnique({ where: { id } })
}

export async function createAnnouncement(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const rawData = {
        title: formData.get("title")?.toString() || "",
        content: formData.get("content")?.toString() || "",
        type: formData.get("type")?.toString() || "INFO",
        isActive: formData.get("isActive") === "on",
        expiresAt: formData.get("expiresAt")?.toString() || undefined,
    }

    const validated = AnnouncementSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.announcement.create({
            data: validated.data
        })
    } catch (error) {
        return { error: "Gagal membuat pengumuman" }
    }

    revalidatePath("/dashboard/announcements")
    revalidatePath("/") // Revalidate homepage potentially
    redirect("/dashboard/announcements")
}

export async function updateAnnouncement(id: number, prevState: any, formData: FormData) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const rawData = {
        title: formData.get("title")?.toString() || "",
        content: formData.get("content")?.toString() || "",
        type: formData.get("type")?.toString() || "INFO",
        isActive: formData.get("isActive") === "on",
        expiresAt: formData.get("expiresAt")?.toString() || undefined,
    }

    const validated = AnnouncementSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.announcement.update({
            where: { id },
            data: validated.data
        })
    } catch (error) {
        return { error: "Gagal update pengumuman" }
    }

    revalidatePath("/dashboard/announcements")
    revalidatePath("/")
    redirect("/dashboard/announcements")
}

export async function deleteAnnouncement(id: number) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    try {
        await prisma.announcement.delete({ where: { id } })
        revalidatePath("/dashboard/announcements")
        revalidatePath("/")
        revalidatePath("/pengumuman")
        return { success: true }
    } catch (error) {
        return { error: "Gagal hapus pengumuman" }
    }
}

export async function toggleAnnouncementStatus(id: number, currentStatus: boolean) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    try {
        await prisma.announcement.update({
            where: { id },
            data: { isActive: !currentStatus }
        })
        revalidatePath("/dashboard/announcements")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        return { error: "Gagal update status" }
    }
}
