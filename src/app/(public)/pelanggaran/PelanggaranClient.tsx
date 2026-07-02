'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ShieldAlert, ShieldCheck, X, Lock, AlertTriangle, Eye } from "lucide-react"
import { verifyAccessKey, logoutTeacherMode } from "@/actions/violation"

interface Student {
    id: number
    nis: string
    name: string
    class: string
    totalPoints: number
}

interface Props {
    students: Student[]
    teacherMode: boolean
    searchQuery: string
}

function getPointsBadge(points: number) {
    if (points === 0) return { color: "bg-gray-100 text-gray-600", label: "0 poin" }
    if (points < 25) return { color: "bg-yellow-100 text-yellow-700", label: `${points} poin` }
    if (points < 50) return { color: "bg-orange-100 text-orange-700", label: `${points} poin` }
    return { color: "bg-red-100 text-red-700 font-bold", label: `${points} poin ⚠️` }
}

export default function PelanggaranClient({ students, teacherMode, searchQuery }: Props) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [accessKey, setAccessKey] = useState("")
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState(searchQuery)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (search) params.set("q", search)
        router.push(`/pelanggaran?${params.toString()}`)
    }

    const handleAccessKey = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const formData = new FormData()
        formData.set("accessKey", accessKey)
        startTransition(async () => {
            const result = await verifyAccessKey(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                setShowModal(false)
                setAccessKey("")
                router.refresh()
            }
        })
    }

    const handleLogout = () => {
        startTransition(async () => {
            await logoutTeacherMode()
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white">
                <div className="container mx-auto px-4 py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
                                <ShieldAlert className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Catatan Pelanggaran Siswa</h1>
                                <p className="text-red-100 mt-1 text-sm">
                                    MTsN 1 Pacitan · Data Terbuka untuk Siswa, Orang Tua, dan Guru
                                </p>
                            </div>
                        </div>
                        {/* Teacher Mode Button */}
                        {teacherMode ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium backdrop-blur">
                                    <ShieldCheck className="h-4 w-4" />
                                    Mode Guru Aktif
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 text-sm transition"
                                >
                                    <X className="h-4 w-4" />
                                    Keluar Mode Guru
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-5 py-2.5 text-sm font-medium backdrop-blur transition"
                            >
                                <Lock className="h-4 w-4" />
                                Mode Guru
                            </button>
                        )}
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
                        <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">{students.length}</div>
                            <div className="text-xs text-red-100 mt-0.5">Total Siswa</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">
                                {students.filter(s => s.totalPoints > 0).length}
                            </div>
                            <div className="text-xs text-red-100 mt-0.5">Ada Pelanggaran</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">
                                {students.filter(s => s.totalPoints >= 50).length}
                            </div>
                            <div className="text-xs text-red-100 mt-0.5">Poin Kritis (≥50)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari nama siswa atau NIS..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => { setSearch(""); router.push("/pelanggaran") }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="px-5 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition shadow-sm"
                    >
                        Cari
                    </button>
                </form>

                {searchQuery && (
                    <p className="text-sm text-gray-500 mb-4">
                        Menampilkan hasil untuk: <span className="font-medium text-gray-800">"{searchQuery}"</span> · {students.length} ditemukan
                    </p>
                )}

                {/* Teacher Mode Banner */}
                {teacherMode && (
                    <div className="mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span><strong>Mode Guru Aktif</strong> — Anda dapat mencatat pelanggaran siswa menggunakan tombol "Catat Pelanggaran" di setiap baris.</span>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-100 px-4 py-3">
                        <div className="text-xs font-semibold uppercase text-gray-500">NIS</div>
                        <div className="col-span-2 text-xs font-semibold uppercase text-gray-500">Nama Siswa</div>
                        <div className="text-xs font-semibold uppercase text-gray-500 text-center">Kelas</div>
                        <div className="text-xs font-semibold uppercase text-gray-500 text-right">Aksi</div>
                    </div>

                    {students.length === 0 ? (
                        <div className="py-16 text-center text-gray-400">
                            <ShieldAlert className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                            <p className="font-medium text-gray-500">Tidak ada siswa ditemukan</p>
                            {searchQuery && (
                                <p className="text-sm mt-1">Coba gunakan kata kunci yang berbeda.</p>
                            )}
                        </div>
                    ) : (
                        students.map((student, idx) => {
                            const badge = getPointsBadge(student.totalPoints)
                            return (
                                <div
                                    key={student.id}
                                    className={`grid grid-cols-5 items-center px-4 py-3.5 hover:bg-gray-50 transition ${idx < students.length - 1 ? "border-b border-gray-100" : ""}`}
                                >
                                    <div className="text-sm font-mono text-gray-500">{student.nis}</div>
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                            <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {student.class}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/pelanggaran/${student.id}`}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                        >
                                            <Eye className="h-3 w-3" />
                                            Detail
                                        </Link>
                                        {teacherMode && (
                                            <Link
                                                href={`/pelanggaran/${student.id}#catat`}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                                            >
                                                <AlertTriangle className="h-3 w-3" />
                                                Catat
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Public Note */}
                <p className="mt-4 text-center text-xs text-gray-400">
                    Data pelanggaran ini bersifat transparan dan dapat dilihat oleh seluruh warga madrasah. Untuk mencatat pelanggaran, aktifkan Mode Guru.
                </p>
            </div>

            {/* Teacher Mode Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <Lock className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Mode Guru</h2>
                                    <p className="text-xs text-gray-500">Masukkan kode akses untuk melanjutkan</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowModal(false); setError(""); setAccessKey("") }} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAccessKey} className="space-y-4">
                            {error && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Kode Akses Guru
                                </label>
                                <input
                                    type="password"
                                    value={accessKey}
                                    onChange={e => setAccessKey(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    autoFocus
                                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-60"
                            >
                                {isPending ? "Memverifikasi..." : "Masuk Mode Guru"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
