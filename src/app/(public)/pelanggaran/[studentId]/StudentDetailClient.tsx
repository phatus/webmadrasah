'use client'

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldAlert, ShieldCheck, Calendar, User, AlertTriangle, Trash2, Plus } from "lucide-react"
import { createViolation, deleteViolation } from "@/actions/violation"

interface Violation {
    id: number
    violationDate: Date
    description: string
    penalty: string | null
    points: number
    reporterName: string
    createdAt: Date
}

interface Student {
    id: number
    nis: string
    name: string
    class: string
    violations: Violation[]
}

interface Props {
    student: Student
    teacherMode: boolean
    totalPoints: number
}

const initialState = { error: '', fieldErrors: {} as Record<string, string[]> }

function getPointsColor(points: number) {
    if (points === 0) return "text-gray-500 bg-gray-100"
    if (points < 25) return "text-yellow-700 bg-yellow-100"
    if (points < 50) return "text-orange-700 bg-orange-100"
    return "text-red-700 bg-red-100"
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export default function StudentDetailClient({ student, teacherMode, totalPoints }: Props) {
    const createViolationForStudent = createViolation.bind(null)
    const [state, formAction, isPending] = useActionState(createViolationForStudent, initialState)

    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className={`${totalPoints >= 50 ? 'bg-gradient-to-r from-red-700 via-red-600 to-orange-600' : 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700'} text-white`}>
                <div className="container mx-auto px-4 py-8">
                    <Link href="/pelanggaran" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-5 transition">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Rekap Pelanggaran
                    </Link>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{student.name}</h1>
                                <div className="flex items-center gap-3 mt-1 text-sm text-white/80">
                                    <span>NIS: {student.nis}</span>
                                    <span>·</span>
                                    <span className="bg-white/20 rounded-full px-3 py-0.5">{student.class}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className={`text-center px-5 py-3 rounded-2xl ${totalPoints >= 50 ? 'bg-white/20' : 'bg-white/15'} backdrop-blur`}>
                                <div className="text-4xl font-bold">{totalPoints}</div>
                                <div className="text-xs text-white/70 mt-0.5">Total Poin Pelanggaran</div>
                            </div>
                            {totalPoints >= 50 && (
                                <div className="flex items-center gap-1.5 text-xs text-red-200 bg-red-800/40 rounded-full px-3 py-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Poin Kritis — Perlu Penanganan Khusus
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Teacher Mode Active Banner */}
                {teacherMode && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span><strong>Mode Guru Aktif</strong> — Form pencatatan pelanggaran tersedia di bawah riwayat pelanggaran.</span>
                    </div>
                )}

                {/* Violation History */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                            <h2 className="font-semibold text-gray-900">Riwayat Pelanggaran</h2>
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                {student.violations.length} catatan
                            </span>
                        </div>
                    </div>

                    {student.violations.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">
                            <ShieldCheck className="mx-auto h-10 w-10 text-green-300 mb-3" />
                            <p className="font-medium text-gray-500">Belum ada catatan pelanggaran</p>
                            <p className="text-sm mt-1 text-green-600">Siswa ini memiliki rekam jejak yang bersih 👍</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {student.violations.map((v) => (
                                <div key={v.id} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className={`mt-0.5 flex-shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg ${getPointsColor(v.points)} min-w-[48px] text-center`}>
                                            +{v.points}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm">{v.description}</p>
                                            {v.penalty && (
                                                <p className="text-xs text-orange-600 mt-0.5">
                                                    <span className="font-medium">Sanksi:</span> {v.penalty}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(v.violationDate)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {v.reporterName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {teacherMode && (
                                        <button
                                            onClick={async () => {
                                                if (confirm("Apakah Anda yakin ingin menghapus catatan pelanggaran ini?")) {
                                                    const res = await deleteViolation(v.id, student.id)
                                                    if (res?.error) {
                                                        alert(res.error)
                                                    }
                                                }
                                            }}
                                            className="text-gray-300 hover:text-red-500 transition mt-1"
                                            title="Hapus catatan ini"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Violation Form - Teacher Only */}
                {teacherMode && (
                    <div id="catat" className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-red-100 bg-red-50 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-red-600" />
                            <h2 className="font-semibold text-red-800">Catat Pelanggaran Baru</h2>
                        </div>
                        <form action={formAction} className="p-5 space-y-4">
                            <input type="hidden" name="studentId" value={student.id} />

                            {state.error && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                    {state.error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Pelanggaran <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="violationDate"
                                        defaultValue={today}
                                        max={today}
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Poin Pelanggaran <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="points"
                                        min={1}
                                        max={100}
                                        placeholder="misal: 10"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                    />
                                    {state.fieldErrors?.points && (
                                        <p className="mt-1 text-xs text-red-600">{state.fieldErrors.points[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jenis / Deskripsi Pelanggaran <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    rows={2}
                                    placeholder="Contoh: Tidak memakai seragam lengkap, terlambat masuk kelas..."
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                                />
                                {state.fieldErrors?.description && (
                                    <p className="mt-1 text-xs text-red-600">{state.fieldErrors.description[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sanksi yang Diberikan <span className="text-gray-400 text-xs">(opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="penalty"
                                    placeholder="Contoh: Teguran lisan, panggilan orang tua..."
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Guru Pelapor <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="reporterName"
                                    placeholder="Nama lengkap beserta gelar (opsional)"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                                {state.fieldErrors?.reporterName && (
                                    <p className="mt-1 text-xs text-red-600">{state.fieldErrors.reporterName[0]}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                <ShieldAlert className="h-4 w-4" />
                                {isPending ? "Menyimpan..." : "Simpan Catatan Pelanggaran"}
                            </button>
                        </form>
                    </div>
                )}

                {/* CTA to activate teacher mode if not active */}
                {!teacherMode && (
                    <div className="text-center py-4">
                        <Link
                            href="/pelanggaran"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            Guru? Aktifkan Mode Guru di halaman rekap untuk mencatat pelanggaran
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
