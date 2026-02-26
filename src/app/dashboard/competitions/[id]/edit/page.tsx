import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import EditCompetitionForm from "./edit-form"

export default async function EditCompetitionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const competition = await prisma.competition.findUnique({
        where: { id: Number(id) }
    })

    if (!competition) {
        notFound()
    }

    return <EditCompetitionForm competition={competition} />
}
