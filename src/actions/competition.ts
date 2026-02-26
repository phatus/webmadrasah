'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import slugify from "slugify"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getCompetitions(onlyActive = false) {
    const where = onlyActive ? { isActive: true, endDate: { gte: new Date() } } : {}
    return await prisma.competition.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { submissions: true } } }
    })
}

export async function getCompetitionBySlug(slug: string) {
    return await prisma.competition.findUnique({
        where: { slug },
    })
}

export async function createCompetition(formData: FormData) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const image = formData.get("image") as string
    const startDate = new Date(formData.get("startDate") as string)
    const endDate = new Date(formData.get("endDate") as string)
    const isActive = formData.get("isActive") === "on"

    if (!title || !startDate || !endDate) return { error: "Title and dates are required" }

    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now()

    try {
        await prisma.competition.create({
            data: {
                title,
                slug,
                description,
                image,
                startDate,
                endDate,
                isActive,
            }
        })
    } catch (err) {
        console.error(err)
        return { error: "Failed to create competition" }
    }

    revalidatePath('/dashboard/competitions')
    redirect('/dashboard/competitions')
}

export async function updateCompetition(id: number, formData: FormData) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const image = formData.get("image") as string
    const startDate = new Date(formData.get("startDate") as string)
    const endDate = new Date(formData.get("endDate") as string)
    const isActive = formData.get("isActive") === "on"

    if (!title || !startDate || !endDate) return { error: "Title and dates are required" }

    const competition = await prisma.competition.findUnique({ where: { id } })
    if (!competition) return { error: "Competition not found" }

    let slug = competition.slug
    if (competition.title !== title) {
        slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now()
    }

    try {
        await prisma.competition.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                image,
                startDate,
                endDate,
                isActive,
            }
        })
    } catch (err) {
        console.error(err)
        return { error: "Failed to update competition" }
    }

    revalidatePath('/dashboard/competitions')
    redirect('/dashboard/competitions')
}

export async function deleteCompetition(id: number) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized")

    await prisma.competition.delete({ where: { id } })
    revalidatePath('/dashboard/competitions')
}

export async function getSubmissions(competitionId: number) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized")

    return await prisma.competitionSubmission.findMany({
        where: { competitionId },
        orderBy: { createdAt: 'desc' }
    })
}

export async function updateSubmissionStatus(id: number, status: string) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") throw new Error("Unauthorized")

    await prisma.competitionSubmission.update({
        where: { id },
        data: { status }
    })

    // Get competition ID for revalidation
    const submission = await prisma.competitionSubmission.findUnique({
        where: { id },
        select: { competitionId: true }
    })

    if (submission) {
        revalidatePath(`/dashboard/competitions/${submission.competitionId}/submissions`)
    }
}
