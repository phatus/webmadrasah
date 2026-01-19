'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import slugify from "slugify"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getCategories() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { posts: true } } }
    })
    return categories
}

export async function createCategory(formData: FormData) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    if (!name) return { error: "Name is required" }

    const slug = slugify(name, { lower: true, strict: true })

    try {
        await prisma.category.create({
            data: { name, slug }
        })
    } catch (error) {
        console.error(error)
        return { error: "Failed to create category" }
    }

    revalidatePath("/dashboard/categories")
    redirect("/dashboard/categories")
}

export async function deleteCategory(id: number) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    try {
        await prisma.category.delete({ where: { id } })
    } catch (error) {
        console.error("Failed to delete category (probably has posts)", error)
    }

    revalidatePath("/dashboard/categories")
}
