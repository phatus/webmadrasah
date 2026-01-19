'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema for Hero Section
const HeroSchema = z.object({
    title: z.string().min(1, "Judul harus diisi"),
    content: z.string().min(1, "Deskripsi harus diisi"),
    image: z.string().optional(),
    primaryButtonText: z.string().optional(),
    primaryButtonLink: z.string().optional(),
    secondaryButtonText: z.string().optional(),
    secondaryButtonLink: z.string().optional(),
})

// Schema for a single Card
const CardItemSchema = z.object({
    title: z.string().min(1, "Judul kartu harus diisi"),
    description: z.string().min(1, "Deskripsi kartu harus diisi"),
    link: z.string().optional(),
    icon: z.string().optional(), // We'll store icon name as string
    color: z.string().optional(), // For border/icon color
})

// Schema for Cards Section (Array of Cards)
const CardsSchema = z.object({
    cards: z.array(CardItemSchema)
})

import { unstable_cache } from "next/cache"

export async function getHomeData(key: string) {
    return await unstable_cache(
        async () => {
            try {
                const data = await prisma.pageContent.findUnique({
                    where: { key }
                })
                return data
            } catch (error) {
                console.error(`Error fetching home data for ${key}:`, error)
                return null
            }
        },
        [`home-data-${key}`], // keys
        { tags: [`home-data-${key}`], revalidate: 3600 } // revalidate every hour or on tag invalidation
    )()
}

export async function updateHero(prevState: any, formData: FormData) {
    const rawData = {
        title: formData.get("title")?.toString() || "",
        content: formData.get("content")?.toString() || "",
        image: formData.get("image")?.toString() || undefined,
        primaryButtonText: formData.get("primaryButtonText")?.toString() || undefined,
        primaryButtonLink: formData.get("primaryButtonLink")?.toString() || undefined,
        secondaryButtonText: formData.get("secondaryButtonText")?.toString() || undefined,
        secondaryButtonLink: formData.get("secondaryButtonLink")?.toString() || undefined,
    }

    const validated = HeroSchema.safeParse(rawData)

    if (!validated.success) {
        const errorMessages = validated.error.flatten().fieldErrors;
        // Get the first error message from any field
        const firstError = Object.values(errorMessages).flat()[0] || "Validation failed";
        return { error: firstError }
    }

    const { title, content, ...metaData } = validated.data

    try {
        await prisma.pageContent.upsert({
            where: { key: "home_hero" },
            update: {
                title,
                content,
                meta: JSON.stringify(metaData)
            },
            create: {
                key: "home_hero",
                title,
                content,
                meta: JSON.stringify(metaData)
            }
        })

        revalidatePath("/")
        return { success: "Hero section updated successfully" }
    } catch (error) {
        console.error("Error updating hero:", error)
        return { error: "Failed to update hero section" }
    }
}

export async function updateCards(cardsData: any[]) {
    // Manually validating array for simplicity, or use Zod
    // Expecting array of objects

    try {
        await prisma.pageContent.upsert({
            where: { key: "home_cards" },
            update: {
                title: "Home Cards",
                content: "Data for Homepage Cards",
                meta: JSON.stringify(cardsData)
            },
            create: {
                key: "home_cards",
                title: "Home Cards",
                content: "Data for Homepage Cards",
                meta: JSON.stringify(cardsData)
            }
        })

        revalidatePath("/")
        return { success: "Cards updated successfully" }
    } catch (error) {
        console.error("Error updating cards:", error)
        return { error: "Failed to update cards" }
    }
}
