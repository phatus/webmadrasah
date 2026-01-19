'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import slugify from "slugify"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const PostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    excerpt: z.string().optional(),
    image: z.string().optional(),
})

export async function getPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true } } }
        }),
        prisma.post.count()
    ])

    return { posts, total, totalPages: Math.ceil(total / limit) }
}

import { unstable_cache } from "next/cache"

export const getCachedPosts = unstable_cache(
    async (page = 1, limit = 10) => getPosts(page, limit),
    ['posts-list'],
    { tags: ['posts'], revalidate: 60 }
)

export async function getPost(slug: string) {
    return await prisma.post.findUnique({
        where: { slug },
        include: { author: { select: { name: true, image: true, bio: true } } }
    })
}

export async function getPostById(id: number) {
    return await prisma.post.findUnique({
        where: { id },
    })
}

export async function createPost(formData: FormData) {
    const session = await auth()
    if (!session || !session.user || !session.user.id) throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const image = formData.get("image") as string // simplified for now

    // Validate
    if (!title || !content) return { error: "Title and content required" }

    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now()

    try {
        await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                image,
                published: true,
                authorId: Number(session.user.id),
                categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
                metaTitle: formData.get("metaTitle") as string,
                metaDescription: formData.get("metaDescription") as string,
                ogImage: formData.get("ogImage") as string,
            }
        })
    } catch (err) {
        console.error(err)
        return { error: "Failed to create post" }
    }

    revalidatePath('/')
    revalidatePath('/dashboard/posts')
    redirect('/dashboard/posts')
}

export async function deletePost(id: number) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    await prisma.post.delete({ where: { id } })
    revalidatePath('/dashboard/posts')
}

export async function updatePost(id: number, formData: FormData) {
    const session = await auth()
    if (!session) redirect("/api/auth/signin")

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const image = formData.get("image") as string

    // Validate
    if (!title || !content) return { error: "Title and content required" }

    const slug = slugify(title, { lower: true, strict: true })

    try {
        await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                image,
                categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
                metaTitle: formData.get("metaTitle") as string,
                metaDescription: formData.get("metaDescription") as string,
                ogImage: formData.get("ogImage") as string,
            }
        })
    } catch (err) {
        console.error(err)
        return { error: "Failed to update post" }
    }

    revalidatePath('/')
    revalidatePath('/dashboard/posts')
    redirect('/dashboard/posts')
}
