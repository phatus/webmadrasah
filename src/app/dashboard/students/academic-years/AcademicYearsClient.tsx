'use client'

import { useActionState, useState, useTransition } from "react"
import { createAcademicYear, setActiveAcademicYear, deleteAcademicYear } from "@/actions/academic-year"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Plus, CheckCircle2, Trash2, Star } from "lucide-react"

type AcademicYear = {
    id: number
    name: string
    isActive: boolean
    startDate: Date
    endDate: Date
    createdAt: Date
    _count: { classHistory: number }
}

const initialState = { error: '', fieldErrors: {} as Record<string, string[]>, success: false, message: '' }

export default function AcademicYearsClient({ years }: { years: AcademicYear[] }) {
    const [state, formAction, isPending] = useActionState(createAcademicYear, initialState)
    const [showForm, setShowForm] = useState(false)
    const [isPendingAction, startTransition] = useTransition()
    const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSetActive = (id: number) => {
        startTransition(async () => {
            const result = await setActiveAcademicYear(id)
            if (result.error) setActionMsg({ type: 'error', text: result.error })
            else setActionMsg({ type: 'success', text: 'Tahun pelajaran aktif diubah.' })
            setTimeout(() => setActionMsg(null), 3000)
        })
    }

    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Hapus tahun pelajaran "${name}"?`)) return
        startTransition(async () => {
            const result = await deleteAcademicYear(id)
            if (result.error) setActionMsg({ type: 'error', text: result.error })
            else setActionMsg({ type: 'success', text: 'Tahun pelajaran dihapus.' })
            setTimeout(() => setActionMsg(null), 3000)
        })
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default sm:px-7.5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/students" className="text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-black">Tahun Pelajaran</h4>
                        <p className="text-sm text-gray-500">Kelola tahun ajaran madrasah</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/students/promote"
                        className="inline-flex items-center gap-2 rounded bg-emerald-600 py-2.5 px-4 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                        Proses Kenaikan Kelas →
                    </Link>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="inline-flex items-center gap-2 rounded border border-indigo-300 bg-indigo-50 py-2.5 px-4 text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Tahun Pelajaran
                    </button>
                </div>
            </div>

            {/* Action Message */}
            {actionMsg && (
                <div className={`mb-4 rounded-md px-4 py-3 text-sm ${actionMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {actionMsg.text}
                </div>
            )}

            {/* Add Form */}
            {showForm && (
                <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50/50 p-5">
                    <h5 className="text-sm font-semibold text-indigo-900 mb-4">Tambah Tahun Pelajaran Baru</h5>
                    {state.error && (
                        <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{state.error}</div>
                    )}
                    {state.success && (
                        <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">{state.message}</div>
                    )}
                    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nama (contoh: 2025/2026) <span className="text-red-500">*</span></label>
                            <input name="name" type="text" placeholder="2025/2026" required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Mulai <span className="text-red-500">*</span></label>
                            <input name="startDate" type="date" required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Selesai <span className="text-red-500">*</span></label>
                            <input name="endDate" type="date" required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="sm:col-span-3 flex gap-2">
                            <button type="submit" disabled={isPending}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-60">
                                {isPending ? "Menyimpan..." : "Simpan"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="flex flex-col">
                <div className="grid grid-cols-5 rounded-sm bg-gray-100 p-2.5">
                    <div className="p-2.5"><h5 className="text-xs font-medium uppercase text-gray-600">Nama</h5></div>
                    <div className="p-2.5"><h5 className="text-xs font-medium uppercase text-gray-600">Periode</h5></div>
                    <div className="p-2.5 text-center"><h5 className="text-xs font-medium uppercase text-gray-600">Status</h5></div>
                    <div className="p-2.5 text-center"><h5 className="text-xs font-medium uppercase text-gray-600">Riwayat Kelas</h5></div>
                    <div className="p-2.5 text-center"><h5 className="text-xs font-medium uppercase text-gray-600">Aksi</h5></div>
                </div>

                {years.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                        <CalendarDays className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <p>Belum ada tahun pelajaran.</p>
                        <p className="text-sm mt-1">Klik &quot;Tambah Tahun Pelajaran&quot; untuk memulai.</p>
                    </div>
                ) : (
                    years.map((year, idx) => (
                        <div key={year.id} className={`grid grid-cols-5 items-center ${idx === years.length - 1 ? '' : 'border-b border-gray-100'}`}>
                            <div className="p-3.5 flex items-center gap-2">
                                {year.isActive && <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />}
                                <span className="font-semibold text-black">{year.name}</span>
                            </div>
                            <div className="p-3.5 text-sm text-gray-600">
                                {new Date(year.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                {' — '}
                                {new Date(year.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="p-3.5 text-center">
                                {year.isActive ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                        <CheckCircle2 className="h-3 w-3" /> Aktif
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">Tidak Aktif</span>
                                )}
                            </div>
                            <div className="p-3.5 text-center text-sm text-gray-600">
                                {year._count.classHistory} catatan
                            </div>
                            <div className="p-3.5 flex items-center justify-center gap-2">
                                {!year.isActive && (
                                    <button
                                        onClick={() => handleSetActive(year.id)}
                                        disabled={isPendingAction}
                                        className="rounded-md border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                                    >
                                        Jadikan Aktif
                                    </button>
                                )}
                                {!year.isActive && year._count.classHistory === 0 && (
                                    <button
                                        onClick={() => handleDelete(year.id, year.name)}
                                        disabled={isPendingAction}
                                        className="text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                                {year.isActive && (
                                    <span className="text-xs text-gray-400 italic">Tahun aktif</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
