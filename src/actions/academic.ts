'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import slugify from "slugify"
import { deleteImages } from "@/lib/cloudinary"

// === AGENDA ===

export async function getAgendas(limit?: number) {
    return await prisma.agenda.findMany({
        orderBy: { date: 'asc' },
        take: limit,
        where: {
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    })
}

export async function createAgenda(formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const date = new Date(formData.get("date") as string)
    const location = formData.get("location") as string
    const description = formData.get("description") as string

    // Check if date is valid
    if (isNaN(date.getTime())) {
        return { error: "Invalid date" }
    }

    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now()

    await prisma.agenda.create({
        data: { title, slug, date, location, description }
    })

    revalidatePath("/dashboard/agendas")
    redirect("/dashboard/agendas")
}

export async function deleteAgenda(id: number) {
    await prisma.agenda.delete({ where: { id } })
    revalidatePath("/dashboard/agendas")
    revalidatePath("/")
    revalidatePath("/agenda")
}


// === DOWNLOAD ===

export async function getDownloads() {
    return await prisma.download.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createDownload(formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const fileUrl = formData.get("fileUrl") as string
    const category = formData.get("category") as string

    if (!fileUrl) return { error: "File required" }

    await prisma.download.create({
        data: { title, fileUrl, category }
    })

    revalidatePath("/dashboard/downloads")
    redirect("/dashboard/downloads")
}

export async function deleteDownload(id: number) {
    await prisma.download.delete({ where: { id } })
    revalidatePath("/dashboard/downloads")
    revalidatePath("/download")
}


// === GALLERY ===

export async function getGalleries() {
    return await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getGallery(id: number) {
    return await prisma.gallery.findUnique({ where: { id } })
}

export async function createGallery(formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const cover = formData.get("cover") as string
    // images will be passed as a hidden input carrying a JSON string or multiple inputs?
    // Simplified: Just use 'images' input which is a JSON string from the client
    const imagesJson = formData.get("images") as string

    await prisma.gallery.create({
        data: {
            title,
            description,
            cover,
            images: imagesJson || "[]"
        }
    })

    revalidatePath("/dashboard/galleries")
    redirect("/dashboard/galleries")
}

export async function updateGallery(id: number, formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const cover = formData.get("cover") as string
    const imagesJson = formData.get("images") as string

    await prisma.gallery.update({
        where: { id },
        data: {
            title,
            description,
            cover,
            images: imagesJson || "[]"
        }
    })

    revalidatePath("/dashboard/galleries")
    redirect("/dashboard/galleries")
}

export async function deleteGallery(id: number) {
    const gallery = await prisma.gallery.findUnique({ where: { id } });

    if (gallery) {
        if (gallery.images) {
            try {
                const images = JSON.parse(gallery.images) as string[];
                await deleteImages(images);
            } catch (e) {
                console.error("Failed to parse images json", e)
            }
        }
        if (gallery.cover) {
            await deleteImages([gallery.cover]);
        }
    }

    await prisma.gallery.delete({ where: { id } })
    revalidatePath("/dashboard/galleries")
    revalidatePath("/galeri")
}
