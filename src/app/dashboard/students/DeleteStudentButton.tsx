'use client'

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteStudent } from "@/actions/student"

interface Props {
    studentId: number
    studentName: string
}

export default function DeleteStudentButton({ studentId, studentName }: Props) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm(`Hapus data siswa "${studentName}"? Semua catatan pelanggaran siswa ini juga akan dihapus.`)) {
            startTransition(async () => {
                const res = await deleteStudent(studentId)
                if (res?.error) {
                    alert(res.error)
                }
            })
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Hapus"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    )
}
