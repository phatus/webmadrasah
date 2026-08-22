import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAcademicYears } from "@/actions/academic-year"
import AcademicYearsClient from "./AcademicYearsClient"

export const metadata = {
    title: "Tahun Pelajaran | Dashboard",
}

export default async function AcademicYearsPage() {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const years = await getAcademicYears()

    return <AcademicYearsClient years={years} />
}
