
'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const PageContentSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    content: z.string().min(1, "Konten wajib diisi"),
})

export async function getPageContent(key: string) {
    try {
        const page = await prisma.pageContent.findUnique({
            where: { key }
        })
        return page
    } catch (error) {
        console.error("Error fetching page content:", error)
        return null
    }
}

const UpdatePageSchema = z.object({
    title: z.string().min(1, "Judul tidak boleh kosong"),
    content: z.string().min(1, "Konten tidak boleh kosong"),
    meta: z.string().nullish(), // Allow null or undefined
})

export async function updatePageContent(key: string, prevState: any, formData: FormData) {
    const validatedFields = UpdatePageSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        meta: formData.get('meta'),
    })

    if (!validatedFields.success) {
        console.error("Validation Error:", validatedFields.error.flatten())
        return {
            error: validatedFields.error.flatten().fieldErrors.title?.[0] ||
                validatedFields.error.flatten().fieldErrors.content?.[0] ||
                "Gagal memvalidasi data",
        }
    }

    try {
        await prisma.pageContent.upsert({
            where: { key },
            update: {
                title: validatedFields.data.title,
                content: validatedFields.data.content,
                meta: validatedFields.data.meta,
            },
            create: {
                key,
                title: validatedFields.data.title,
                content: validatedFields.data.content,
                meta: validatedFields.data.meta,
            }
        })

        revalidatePath(`/dashboard/profil/${key}`)
        revalidatePath(`/profil/${key}`) // Revalidate public path as well (adjust if needed)

        // Specific revalidation for known public routes
        if (key === 'sambutan') revalidatePath('/profil/sambutan-kepala')
        if (key === 'visi-misi') revalidatePath('/profil/visi-misi')
        if (key === 'sejarah') revalidatePath('/profil/sejarah')

        return {
            success: true,
            message: "Halaman berhasil diperbarui"
        }
    } catch (error) {
        console.error("Error updating page content:", error)
        // Log detailed error for debugging
        if (error instanceof Error) {
            console.error("Detailed Error:", error.message, error.stack)
        }
        return {
            error: "Gagal memperbarui halaman. Detail: " + (error instanceof Error ? error.message : String(error))
        }
    }
}
