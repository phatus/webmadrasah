import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAcademicYears } from "@/actions/academic-year"
import { getStudents } from "@/actions/student"
import PromoteClient from "./PromoteClient"

export const metadata = {
    title: "Kenaikan Kelas | Dashboard",
}

export default async function PromotePage() {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const [years, students] = await Promise.all([
        getAcademicYears(),
        getStudents(undefined, 'AKTIF'),
    ])

    return <PromoteClient years={years} students={students} />
}
