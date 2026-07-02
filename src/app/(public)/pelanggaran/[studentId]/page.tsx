import { getStudentWithViolations } from "@/actions/violation"
import { isTeacherMode } from "@/actions/violation"
import { notFound } from "next/navigation"
import StudentDetailClient from "./StudentDetailClient"

export async function generateMetadata({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = await params
    const student = await getStudentWithViolations(Number(studentId))
    return {
        title: student
            ? `Pelanggaran: ${student.name} | MTsN 1 Pacitan`
            : "Siswa Tidak Ditemukan",
    }
}

export default async function StudentViolationDetailPage({
    params,
}: {
    params: Promise<{ studentId: string }>
}) {
    const { studentId } = await params
    const [student, teacherMode] = await Promise.all([
        getStudentWithViolations(Number(studentId)),
        isTeacherMode(),
    ])

    if (!student) notFound()

    const totalPoints = student.violations.reduce((sum: number, v: { points: number }) => sum + v.points, 0)

    return (
        <StudentDetailClient
            student={student}
            teacherMode={teacherMode}
            totalPoints={totalPoints}
        />
    )
}
