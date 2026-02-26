'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function submitWork(competitionId: number, formData: FormData) {
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const school = formData.get("school") as string
    const workUrl = formData.get("workUrl") as string

    if (!fullName || !email || !workUrl) {
        return { error: "Nama, email, dan link karya wajib diisi" }
    }

    try {
        await prisma.competitionSubmission.create({
            data: {
                competitionId,
                fullName,
                email,
                phone,
                school,
                workUrl,
                status: "PENDING"
            }
        })
    } catch (err) {
        console.error(err)
        return { error: "Gagal mengirimkan karya. Silakan coba lagi." }
    }

    const competition = await prisma.competition.findUnique({
        where: { id: competitionId },
        select: { slug: true }
    })

    revalidatePath(`/competitions`)
    if (competition) {
        revalidatePath(`/competitions/${competition.slug}`)
    }

    return { success: true }
}
