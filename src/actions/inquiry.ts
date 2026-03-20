'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { logAudit } from "@/lib/audit"

const InquirySchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    subject: z.string().optional(),
    message: z.string().min(10, "Pesan minimal 10 karakter"),
})

export async function createInquiry(prevState: any, formData: FormData) {
    const rawEmail = formData.get("email")?.toString() || "unknown"
    const email = String(rawEmail).trim()

    // Rate limiting: check before validation
    const rateLimitAllowed = await checkRateLimit(email, 'inquiry')
    if (!rateLimitAllowed) {
        return { error: "Terlalu banyak permintaan. Silakan coba lagi dalam 15 menit." }
    }

    const rawData = {
        name: formData.get("name")?.toString() || "",
        email: email,
        subject: formData.get("subject")?.toString() || "",
        message: formData.get("message")?.toString() || "",
    }

    const validated = InquirySchema.safeParse(rawData)

    if (!validated.success) {
        return {
            error: validated.error.issues[0].message
        }
    }

    try {
        const inquiry = await prisma.inquiry.create({
            data: {
                name: validated.data.name,
                email: validated.data.email,
                subject: validated.data.subject || null,
                message: validated.data.message,
            }
        })

        // Audit log (guest action - userId null)
        await logAudit({
          action: 'CREATE',
          resource: 'INQUIRY',
          resourceId: inquiry.id,
          details: { name: inquiry.name, email: inquiry.email, subject: inquiry.subject }
        })

        return { success: true, message: "Pesan Anda telah terkirim!" }
    } catch (error) {
        console.error("Failed to create inquiry:", error)
        return {
            error: "Gagal mengirim pesan. Silakan coba lagi."
        }
    }
}

export async function getInquiries() {
    // Only authorized users should see this
    const session = await auth()
    if (!session) return []

    try {
        return await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        return []
    }
}

export async function markInquiryAsRead(id: number) {
    const session = await auth()
    if (!session) return

    try {
        await prisma.inquiry.update({
            where: { id },
            data: { isRead: true }
        })
        revalidatePath("/dashboard/inbox")
    } catch (error) {
        console.error("Failed to mark as read", error)
    }
}

export async function deleteInquiry(id: number) {
    const session = await auth()
    if (!session) return

    try {
        await prisma.inquiry.delete({
            where: { id }
        })
        revalidatePath("/dashboard/inbox")
    } catch (error) {
        console.error("Failed to delete inquiry", error)
    }
}
