'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

const AchievementSchema = z.object({
    title: z.string().min(1, "Judul harus diisi"),
    description: z.string().optional(),
    category: z.string().min(1, "Kategori harus dipilih"),
    level: z.string().min(1, "Tingkat harus dipilih"),
    rank: z.string().min(1, "Peringkat harus diisi"),
    date: z.string().transform((str) => new Date(str)),
    image: z.string().optional(),
})

export async function getAchievements() {
    try {
        const achievements = await prisma.achievement.findMany({
            orderBy: { date: 'desc' }
        })
        return { achievements }
    } catch (error) {
        console.error("Error fetching achievements:", error)
        return { error: "Failed to fetch achievements" }
    }
}

export async function getAchievementById(id: number) {
    try {
        const achievement = await prisma.achievement.findUnique({
            where: { id }
        })
        return { achievement }
    } catch (error) {
        return { error: "Achievement not found" }
    }
}

export async function createAchievement(prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        level: formData.get("level")?.toString() || "",
        rank: formData.get("rank")?.toString() || "",
        date: formData.get("date")?.toString() || new Date().toISOString(),
        image: formData.get("image")?.toString() || null,
    }

    const validated = AchievementSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.achievement.create({
            data: validated.data
        })
    } catch (error) {
        console.error("Error creating achievement:", error)
        return { error: "Failed to create achievement" }
    }

    revalidatePath("/dashboard/kesiswaan/prestasi")
    revalidatePath("/prestasi")
    redirect("/dashboard/kesiswaan/prestasi")
}

export async function updateAchievement(id: number, prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        level: formData.get("level")?.toString() || "",
        rank: formData.get("rank")?.toString() || "",
        date: formData.get("date")?.toString() || new Date().toISOString(),
        image: formData.get("image")?.toString() || null,
    }

    const validated = AchievementSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    try {
        await prisma.achievement.update({
            where: { id },
            data: validated.data
        })
    } catch (error) {
        console.error("Error updating achievement:", error)
        return { error: "Failed to update achievement" }
    }

    revalidatePath("/dashboard/kesiswaan/prestasi")
    revalidatePath("/prestasi")
    redirect("/dashboard/kesiswaan/prestasi")
}

export async function deleteAchievement(id: number) {
    try {
        await prisma.achievement.delete({
            where: { id }
        })
        revalidatePath("/dashboard/kesiswaan/prestasi")
        revalidatePath("/prestasi")
        return { success: true }
    } catch (error) {
        return { error: "Failed to delete achievement" }
    }
}
