'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const FacilitySchema = z.object({
    name: z.string().min(3, "Nama fasilitas harus diisi (min 3 karakter)"),
    description: z.string().optional(),
    image: z.string().optional(),
})

export async function getFacilities() {
    try {
        const facilities = await prisma.facility.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return facilities
    } catch (error) {
        console.error("Error fetching facilities:", error)
        return []
    }
}

export async function getFacility(id: number) {
    try {
        const facility = await prisma.facility.findUnique({
            where: { id }
        })
        return facility
    } catch (error) {
        console.error("Error fetching facility:", error)
        return null
    }
}

export async function createFacility(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        image: formData.get("image")?.toString() || undefined,
    }

    const validated = FacilitySchema.safeParse(rawData)

    if (!validated.success) {
        return {
            error: validated.error.issues[0].message
        }
    }

    try {
        await prisma.facility.create({
            data: validated.data
        })
    } catch (error) {
        return {
            error: "Gagal membuat fasilitas"
        }
    }

    revalidatePath("/dashboard/sarana-prasarana")
    revalidatePath("/sarana-prasarana")
    redirect("/dashboard/sarana-prasarana")
}

export async function updateFacility(id: number, prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get("name")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        image: formData.get("image")?.toString() || undefined,
    }

    const validated = FacilitySchema.safeParse(rawData)

    if (!validated.success) {
        return {
            error: validated.error.issues[0].message
        }
    }

    try {
        await prisma.facility.update({
            where: { id },
            data: validated.data
        })
    } catch (error) {
        return {
            error: "Gagal mengupdate fasilitas"
        }
    }

    revalidatePath("/dashboard/sarana-prasarana")
    revalidatePath("/sarana-prasarana")
    redirect("/dashboard/sarana-prasarana")
}

export async function deleteFacility(id: number) {
    try {
        await prisma.facility.delete({
            where: { id }
        })
        revalidatePath("/dashboard/sarana-prasarana")
        revalidatePath("/sarana-prasarana")
        return { success: true }
    } catch (error) {
        return { error: "Gagal menghapus fasilitas" }
    }
}
