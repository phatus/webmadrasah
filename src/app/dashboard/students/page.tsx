import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getStudents } from "@/actions/student"
import StudentsClient from "./StudentsClient"

export const metadata = {
    title: "Data Siswa | Dashboard",
}

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>
}) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { status = 'AKTIF' } = await searchParams
    const students = await getStudents(undefined, status)

    return (
        <StudentsClient
            students={students}
            currentStatus={status}
        />
    )
}
