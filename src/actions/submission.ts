'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { checkRateLimit } from "@/lib/rate-limit"

const SubmissionSchema = z.object({
    fullName: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().optional(),
    school: z.string().optional(),
    workUrl: z.string().url("URL tidak valid").refine(
        (url) => url.startsWith('https://'),
        { message: "URL harus menggunakan HTTPS" }
    )
})

export async function submitWork(competitionId: number, formData: FormData) {
    const rawData = {
        fullName: formData.get("fullName")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        school: formData.get("school")?.toString() || "",
        workUrl: formData.get("workUrl")?.toString() || "",
    }

    // Validate with Zod
    const validated = SubmissionSchema.safeParse(rawData)
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { fullName, email, phone, school, workUrl } = validated.data

    // Rate limiting: per email per competition
    const rateLimitKey = `${email}:${competitionId}`
    const rateLimitAllowed = await checkRateLimit(rateLimitKey, 'competition')
    if (!rateLimitAllowed) {
        return { error: "Anda sudah terlalu banyak submit untuk kompetisi ini. Silakan coba lagi dalam 15 menit." }
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
