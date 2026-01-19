
'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const TeacherSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    nip: z.string().optional(),
    position: z.string().min(1, "Jabatan wajib diisi"),
    subject: z.string().optional(),
    image: z.string().optional(),
})

export async function getTeachers(query?: string) {
    if (query) {
        // DEBUG LOGGING
        console.log('DEBUG: Prisma Keys:', Object.keys(prisma));
        // @ts-ignore
        console.log('DEBUG: Has Teacher?', !!prisma.teacher);

        return await prisma.teacher.findMany({
            where: {
                OR: [
                    { name: { contains: query } },  // SQLite specific, defaults to case-insensitive usually but can be tricky
                    { subject: { contains: query } },
                    { position: { contains: query } },
                ]
            },
            orderBy: { name: 'asc' }
        })
    }

    // DEBUG LOGGING
    console.log('DEBUG: Prisma Keys:', Object.keys(prisma));
    // @ts-ignore
    console.log('DEBUG: Has Teacher?', !!prisma.teacher);

    return await prisma.teacher.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function createTeacher(prevState: any, formData: FormData) {
    const validatedFields = TeacherSchema.safeParse({
        name: formData.get('name'),
        nip: formData.get('nip') || undefined,
        position: formData.get('position'),
        subject: formData.get('subject') || undefined,
        image: formData.get('image') || undefined,
    })

    if (!validatedFields.success) {
        return {
            error: "Validasi gagal. Periksa kembali input Anda.",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        await prisma.teacher.create({
            data: validatedFields.data,
        })
        revalidatePath('/dashboard/gtk')
        revalidatePath('/profil/guru')
    } catch (error) {
        console.error("Failed to create teacher:", error)
        return { error: "Gagal menyimpan data guru." }
    }

    // Redirect must be outside try/catch so it doesn't get caught
    redirect('/dashboard/gtk')
}

export async function updateTeacher(id: number, prevState: any, formData: FormData) {
    const validatedFields = TeacherSchema.safeParse({
        name: formData.get('name'),
        nip: formData.get('nip') || undefined,
        position: formData.get('position'),
        subject: formData.get('subject') || undefined,
        image: formData.get('image') || undefined,
    })

    if (!validatedFields.success) {
        return {
            error: "Validasi gagal.",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        await prisma.teacher.update({
            where: { id },
            data: validatedFields.data,
        })
        revalidatePath('/dashboard/gtk')
        revalidatePath('/profil/guru')
    } catch (error) {
        return { error: "Gagal update data guru." }
    }

    redirect('/dashboard/gtk')
}

export async function deleteTeacher(id: number) {
    try {
        await prisma.teacher.delete({
            where: { id }
        })
        revalidatePath('/dashboard/gtk')
        revalidatePath('/profil/guru')
        return { success: true }
    } catch (error) {
        return { error: "Gagal menghapus data." }
    }
}
