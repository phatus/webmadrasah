
import prisma from "@/lib/db"
import EditTeacherForm from "./edit-form"
import { notFound } from "next/navigation"

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const teacher = await prisma.teacher.findUnique({
        where: {
            id: parseInt(id),
        },
    })

    if (!teacher) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Data Guru & Staf</h1>
            <EditTeacherForm teacher={teacher} />
        </div>
    )
}
