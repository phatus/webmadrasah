'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Helper to extract YouTube ID
function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export async function createVideo(formData: FormData) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const title = formData.get("title") as string
    const url = formData.get("url") as string

    if (!title || !url) return { error: "Judul dan URL wajib diisi" }

    const youtubeId = getYoutubeId(url)
    if (!youtubeId) return { error: "URL YouTube tidak valid. Pastikan URL benar (bisa video biasa atau Shorts)." }

    try {
        await prisma.video.create({
            data: { title, url, youtubeId }
        })
        revalidatePath("/")
        revalidatePath("/dashboard/videos")
        return { success: true, message: "Video berhasil ditambahkan" }
    } catch (error) {
        console.error("Error creating video:", error)
        return { error: "Gagal menyimpan video ke database" }
    }
}

export async function deleteVideo(id: number) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    try {
        await prisma.video.delete({ where: { id } })
        revalidatePath("/")
        revalidatePath("/dashboard/videos")
        return { success: true, message: "Video berhasil dihapus" }
    } catch (error) {
        return { error: "Gagal menghapus video" }
    }
}

export async function getVideos(limit?: number) {
    try {
        return await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        })
    } catch {
        return []
    }
}
