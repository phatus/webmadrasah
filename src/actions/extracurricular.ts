'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

const ExtracurricularSchema = z.object({
    name: z.string().min(1, "Nama ekstrakurikuler harus diisi"),
    description: z.string().optional(),
    image: z.string().optional(),
    schedule: z.string().optional(),
    location: z.string().optional(),
    pembina: z.string().optional(),
})

export async function getExtracurriculars() {
    try {
        const extracurriculars = await prisma.extracurricular.findMany({
            orderBy: { name: 'asc' }
        })
        return { extracurriculars }
    } catch (error) {
        console.error("Error fetching extracurriculars:", error)
        return { error: "Failed to fetch extracurriculars" }
    }
}

export async function getExtracurricularById(id: number) {
    try {
        const extracurricular = await prisma.extracurricular.findUnique({
            where: { id }
        })
        return { extracurricular }
    } catch (error) {
        return { error: "Extracurricular not found" }
    }
}

export async function createExtracurricular(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        image: formData.get("image")?.toString() || null,
        schedule: formData.get("schedule")?.toString() || "",
        location: formData.get("location")?.toString() || "",
        pembina: formData.get("pembina")?.toString() || "",
    }

    const validated = ExtracurricularSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.extracurricular.create({
            data: validated.data
        })
    } catch (error) {
        console.error("Error creating extracurricular:", error)
        return { error: "Failed to create extracurricular" }
    }

    revalidatePath("/dashboard/ekstrakurikuler")
    revalidatePath("/ekstrakurikuler")
    redirect("/dashboard/ekstrakurikuler")
}

export async function updateExtracurricular(id: number, prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        image: formData.get("image")?.toString() || null,
        schedule: formData.get("schedule")?.toString() || "",
        location: formData.get("location")?.toString() || "",
        pembina: formData.get("pembina")?.toString() || "",
    }

    const validated = ExtracurricularSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.extracurricular.update({
            where: { id },
            data: validated.data
        })
    } catch (error) {
        console.error("Error updating extracurricular:", error)
        return { error: "Failed to update extracurricular" }
    }

    revalidatePath("/dashboard/ekstrakurikuler")
    revalidatePath("/ekstrakurikuler")
    redirect("/dashboard/ekstrakurikuler")
}

export async function deleteExtracurricular(id: number) {
    try {
        await prisma.extracurricular.delete({
            where: { id }
        })
        revalidatePath("/dashboard/ekstrakurikuler")
        revalidatePath("/ekstrakurikuler")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete extracurricular" }
    }
}
