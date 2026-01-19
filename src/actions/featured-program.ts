'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"

const ProgramSchema = z.object({
    title: z.string().min(1, "Judul harus diisi"),
    description: z.string().min(1, "Deskripsi harus diisi"),
    icon: z.string().min(1, "Ikon harus dipilih"),
    color: z.string().min(1, "Tema warna harus dipilih"),
})

export async function createProgram(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session) {
        return { error: "Unauthorized" }
    }

    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        icon: formData.get("icon"),
        color: formData.get("color"),
    }

    const validated = ProgramSchema.safeParse(rawData)

    if (!validated.success) {
        return {
            error: validated.error.issues[0].message
        }
    }

    try {
        await prisma.featuredProgram.create({
            data: validated.data
        })
        revalidatePath("/")
        revalidatePath("/dashboard/kesiswaan/program")
        return { success: true, message: "Program unggulan berhasil ditambahkan" }
    } catch (error) {
        return { error: "Gagal menyimpan data" }
    }
}

export async function updateProgram(id: number, prevState: any, formData: FormData) {
    const session = await auth()
    if (!session) {
        return { error: "Unauthorized" }
    }

    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        icon: formData.get("icon"),
        color: formData.get("color"),
    }

    const validated = ProgramSchema.safeParse(rawData)

    if (!validated.success) {
        return {
            error: validated.error.issues[0].message
        }
    }

    try {
        await prisma.featuredProgram.update({
            where: { id },
            data: validated.data
        })
        revalidatePath("/")
        revalidatePath("/dashboard/kesiswaan/program")
        return { success: true, message: "Program unggulan berhasil diperbarui" }
    } catch (error) {
        return { error: "Gagal menyimpan data" }
    }
}

export async function deleteProgram(id: number) {
    const session = await auth()
    if (!session) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.featuredProgram.delete({
            where: { id }
        })
        revalidatePath("/")
        revalidatePath("/dashboard/kesiswaan/program")
        return { success: true, message: "Program unggulan berhasil dihapus" }
    } catch (error) {
        return { error: "Gagal menghapus data" }
    }
}

export async function getPrograms() {
    try {
        return await prisma.featuredProgram.findMany({
            orderBy: { createdAt: 'asc' }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return []
    }
}
