'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import slugify from "slugify"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { logAudit } from "@/lib/audit"

const PostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    excerpt: z.string().optional(),
    image: z.string().optional(),
})

export async function getPosts(page = 1, limit = 10, showUnpublished = false) {
    const skip = (page - 1) * limit
    const where = showUnpublished ? {} : { published: true }
    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            skip,
            take: limit,
            where,
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true } } }
        }),
        prisma.post.count({ where })
    ])

    return { posts, total, totalPages: Math.ceil(total / limit) }
}

import { unstable_cache } from "next/cache"

export async function getCachedPosts(page = 1, limit = 10) {
    return unstable_cache(
        async () => getPosts(page, limit),
        ['posts-list', `page-${page}`, `limit-${limit}`],
        { tags: ['posts'], revalidate: 3600 }
    )()
}

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
        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                image,
                published: formData.get("published") === "on",
                authorId: Number(session.user.id),
                categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
                metaTitle: formData.get("metaTitle") as string,
                metaDescription: formData.get("metaDescription") as string,
                ogImage: formData.get("ogImage") as string,
            }
        })

        // Audit log
        await logAudit({
          userId: Number(session.user.id),
          action: 'CREATE',
          resource: 'POST',
          resourceId: post.id,
          details: { title, published: post.published, authorId: post.authorId }
        })
    } catch (err) {
        console.error("Failed to create post:", err)
        return { error: "Failed to create post" }
    }

    revalidatePath('/')
    revalidatePath('/dashboard/posts')
    revalidatePath('/berita')
    redirect('/dashboard/posts')
}

export async function deletePost(id: number) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    // Check ownership (admin can delete any, editor only own)
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) throw new Error("Post not found")
    if (session.user.role !== 'ADMIN' && post.authorId !== Number(session.user.id)) {
        throw new Error("Unauthorized: You can only delete your own posts")
    }

    await prisma.post.delete({ where: { id } })

    // Audit log
    await logAudit({
      userId: Number(session.user.id),
      action: 'DELETE',
      resource: 'POST',
      resourceId: id,
      details: { title: post.title, authorId: post.authorId }
    })

    revalidatePath('/')
    revalidatePath('/dashboard/posts')
    revalidatePath('/berita')
}

export async function updatePost(id: number, formData: FormData) {
    const session = await auth()
    if (!session) redirect("/api/auth/signin")

    // Check ownership
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return { error: "Post not found" }
    if (session.user.role !== 'ADMIN' && post.authorId !== Number(session.user.id)) {
        return { error: "Unauthorized: You can only edit your own posts" }
    }

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string
    const image = formData.get("image") as string

    // Validate
    if (!title || !content) return { error: "Title and content required" }

    const slug = slugify(title, { lower: true, strict: true })

    try {
        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                image,
                published: formData.get("published") === "on",
                categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
                metaTitle: formData.get("metaTitle") as string,
                metaDescription: formData.get("metaDescription") as string,
                ogImage: formData.get("ogImage") as string,
            }
        })

        // Audit log
        const session = await auth()
        await logAudit({
          userId: Number(session?.user?.id),
          action: 'UPDATE',
          resource: 'POST',
          resourceId: id,
          details: { title, published: post.published }
        })
    } catch (err) {
        console.error("Failed to update post:", err)
        return { error: "Failed to update post" }
    }

    revalidatePath('/')
    revalidatePath('/dashboard/posts')
    revalidatePath('/berita')
    redirect('/dashboard/posts')
}
