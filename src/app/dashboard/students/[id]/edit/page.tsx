import { getStudentById, updateStudent } from "@/actions/student"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import EditStudentForm from "./edit-form"

export const metadata = {
    title: "Edit Siswa | Dashboard",
}

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") redirect("/dashboard")

    const { id } = await params
    const student = await getStudentById(Number(id))
    if (!student) notFound()

    const updateWithId = updateStudent.bind(null, student.id)

    return <EditStudentForm student={student} action={updateWithId} />
}
