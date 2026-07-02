import { getStudents } from "@/actions/student"
import { isTeacherMode } from "@/actions/violation"
import PelanggaranClient from "./PelanggaranClient"

export const metadata = {
    title: "Catatan Pelanggaran Siswa | MTsN 1 Pacitan",
    description: "Rekapitulasi catatan pelanggaran siswa MTsN 1 Pacitan. Dapat diakses oleh siswa, orang tua, dan guru.",
}

export default async function PelanggaranPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const [students, teacherMode] = await Promise.all([
        getStudents(q),
        isTeacherMode(),
    ])

    return (
        <PelanggaranClient
            students={students}
            teacherMode={teacherMode}
            searchQuery={q || ""}
        />
    )
}
