'use client'

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldAlert } from "lucide-react"

const initialState = { error: '', fieldErrors: {} as Record<string, string[]> }

interface Student {
    id: number
    nis: string
    name: string
    class: string
}

export default function EditStudentForm({ student, action }: { student: Student; action: any }) {
    const [state, formAction, isPending] = useActionState(action, initialState)

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default sm:px-7.5">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/dashboard/students" className="text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-black">Edit Data Siswa</h4>
                        <p className="text-sm text-gray-500">Perbarui data siswa: {student.name}</p>
                    </div>
                </div>
            </div>

            <form action={formAction} className="max-w-lg space-y-5">
                {state.error && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                        {state.error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIS <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nis"
                        defaultValue={student.nis}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {state.fieldErrors?.nis && (
                        <p className="mt-1 text-xs text-red-600">{state.fieldErrors.nis[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={student.name}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {state.fieldErrors?.name && (
                        <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kelas <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="class"
                        defaultValue={student.class}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {state.fieldErrors?.class && (
                        <p className="mt-1 text-xs text-red-600">{state.fieldErrors.class[0]}</p>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                        {isPending ? "Menyimpan..." : "Perbarui Data"}
                    </button>
                    <Link
                        href="/dashboard/students"
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-50 transition"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    )
}
