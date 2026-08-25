'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import slugify from "slugify"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { posts: true } } }
        })
        return categories
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function getCategoryById(id: number) {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { posts: true } } }
        })
        return category
    } catch (error) {
        console.error("Error fetching category:", error)
        return null
    }
}

export async function createCategory(formData: FormData) {
    const session = await auth()
    if (!session || !session.user) {
        return { success: false, error: "Tidak memiliki hak akses" }
    }

    const name = (formData.get("name") as string || "").trim()
    let slug = (formData.get("slug") as string || "").trim()

    if (!name) {
        return { success: false, error: "Nama kategori wajib diisi" }
    }

    if (!slug) {
        slug = slugify(name, { lower: true, strict: true }) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    } else {
        slug = slugify(slug, { lower: true, strict: true }) || slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }

    if (!slug) {
        return { success: false, error: "Slug kategori tidak valid" }
    }

    // Check duplicate slug
    const existingSlug = await prisma.category.findUnique({ where: { slug } })
    if (existingSlug) {
        return { success: false, error: `Slug "${slug}" sudah digunakan oleh kategori lain` }
    }

    try {
        const newCategory = await prisma.category.create({
            data: { name, slug }
        })

        await logAudit({
            userId: session.user.id ? Number(session.user.id) : undefined,
            action: 'CREATE',
            resource: 'CATEGORY',
            resourceId: newCategory.id,
            details: { name, slug }
        })

        revalidatePath("/dashboard/categories")
        return { success: true, category: newCategory }
    } catch (error: any) {
        console.error("Error creating category:", error)
        return { success: false, error: error.message || "Gagal membuat kategori" }
    }
}

export async function updateCategory(id: number, formData: FormData) {
    const session = await auth()
    if (!session || !session.user) {
        return { success: false, error: "Tidak memiliki hak akses" }
    }

    const name = (formData.get("name") as string || "").trim()
    let slug = (formData.get("slug") as string || "").trim()

    if (!name) {
        return { success: false, error: "Nama kategori wajib diisi" }
    }

    if (!slug) {
        slug = slugify(name, { lower: true, strict: true }) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    } else {
        slug = slugify(slug, { lower: true, strict: true }) || slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }

    if (!slug) {
        return { success: false, error: "Slug kategori tidak valid" }
    }

    // Check duplicate slug excluding current category
    const existingSlug = await prisma.category.findFirst({
        where: {
            slug,
            NOT: { id }
        }
    })
    if (existingSlug) {
        return { success: false, error: `Slug "${slug}" sudah digunakan oleh kategori lain` }
    }

    try {
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, slug }
        })

        await logAudit({
            userId: session.user.id ? Number(session.user.id) : undefined,
            action: 'UPDATE',
            resource: 'CATEGORY',
            resourceId: id,
            details: { name, slug }
        })

        revalidatePath("/dashboard/categories")
        return { success: true, category: updatedCategory }
    } catch (error: any) {
        console.error("Error updating category:", error)
        return { success: false, error: error.message || "Gagal memperbarui kategori" }
    }
}

export async function deleteCategory(id: number) {
    const session = await auth()
    if (!session || !session.user) {
        return { success: false, error: "Tidak memiliki hak akses" }
    }

    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { posts: true } } }
        })

        if (!category) {
            return { success: false, error: "Kategori tidak ditemukan" }
        }

        if (category._count.posts > 0) {
            return {
                success: false,
                error: `Kategori "${category.name}" tidak dapat dihapus karena masih digunakan oleh ${category._count.posts} berita. Pindahkan atau hapus berita terlebih dahulu.`
            }
        }

        await prisma.category.delete({ where: { id } })

        await logAudit({
            userId: session.user.id ? Number(session.user.id) : undefined,
            action: 'DELETE',
            resource: 'CATEGORY',
            resourceId: id,
            details: { name: category.name, slug: category.slug }
        })

        revalidatePath("/dashboard/categories")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete category:", error)
        return { success: false, error: "Gagal menghapus kategori" }
    }
}

