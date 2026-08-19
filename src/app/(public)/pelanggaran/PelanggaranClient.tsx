'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ShieldAlert, ShieldCheck, X, Lock, AlertTriangle, Eye, Filter, ArrowUpDown, RefreshCw, CheckCircle2 } from "lucide-react"
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
    if (points === 0) return { color: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "0 Poin (Bersih)" }
    if (points < 25) return { color: "bg-amber-50 text-amber-800 border border-amber-200 font-semibold", label: `${points} Poin (Ringan)` }
    if (points < 50) return { color: "bg-orange-50 text-orange-800 border border-orange-200 font-bold", label: `${points} Poin (Sedang)` }
    return { color: "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold animate-pulse", label: `${points} Poin (Kritis) ⚠️` }
}

export default function PelanggaranClient({ students, teacherMode, searchQuery }: Props) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [accessKey, setAccessKey] = useState("")
    const [error, setError] = useState("")
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState(searchQuery)

    // Grouping & Filtering States
    type PointCategory = 'all' | 'has_points' | 'ringan' | 'sedang' | 'kritis' | 'clean'
    const [pointFilter, setPointFilter] = useState<PointCategory>('all')
    const [selectedClass, setSelectedClass] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'points_desc' | 'points_asc' | 'name_asc' | 'class_asc'>('points_desc')

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Unique Classes for Filter Dropdown
    const availableClasses = Array.from(new Set(students.map(s => s.class))).sort()

    // Counts for Category Tabs
    const countAll = students.length
    const countHasPoints = students.filter(s => s.totalPoints > 0).length
    const countRingan = students.filter(s => s.totalPoints >= 1 && s.totalPoints < 25).length
    const countSedang = students.filter(s => s.totalPoints >= 25 && s.totalPoints < 50).length
    const countKritis = students.filter(s => s.totalPoints >= 50).length
    const countClean = students.filter(s => s.totalPoints === 0).length

    // Filter and Sort Processing
    const filteredStudents = students
        .filter((student) => {
            // Filter by Point Category
            if (pointFilter === 'has_points' && student.totalPoints === 0) return false
            if (pointFilter === 'ringan' && (student.totalPoints < 1 || student.totalPoints >= 25)) return false
            if (pointFilter === 'sedang' && (student.totalPoints < 25 || student.totalPoints >= 50)) return false
            if (pointFilter === 'kritis' && student.totalPoints < 50) return false
            if (pointFilter === 'clean' && student.totalPoints !== 0) return false

            // Filter by Class
            if (selectedClass !== 'all' && student.class !== selectedClass) return false

            return true
        })
        .sort((a, b) => {
            if (sortBy === 'points_desc') return b.totalPoints - a.totalPoints
            if (sortBy === 'points_asc') return a.totalPoints - b.totalPoints
            if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
            if (sortBy === 'class_asc') return a.class.localeCompare(b.class)
            return 0
        })

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex)

    const getPageNumbers = () => {
        const pages = []
        const range = 1
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - range && i <= currentPage + range)
            ) {
                pages.push(i)
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...')
            }
        }
        return pages
    }

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

    const resetFilters = () => {
        setPointFilter('all')
        setSelectedClass('all')
        setSortBy('points_desc')
        setSearch('')
        router.push('/pelanggaran')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white shadow-md">
                <div className="container mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur shrink-0 shadow-inner">
                                <ShieldAlert className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight">Catatan Pelanggaran Siswa</h1>
                                <p className="text-red-100 mt-1 text-sm">
                                    MTsN 1 Pacitan · Rekapitulasi Poin & Transparansi Tata Tertib Siswa
                                </p>
                            </div>
                        </div>

                        {/* Teacher Mode Button */}
                        {teacherMode ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur shadow-sm">
                                    <ShieldCheck className="h-4 w-4" />
                                    Mode Guru Aktif
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 text-sm transition font-medium"
                                >
                                    <X className="h-4 w-4" />
                                    Keluar Mode Guru
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-5 py-2.5 text-sm font-bold backdrop-blur transition shadow-md hover:shadow-lg"
                            >
                                <Lock className="h-4 w-4" />
                                Mode Guru
                            </button>
                        )}
                    </div>

                    {/* Interactive Stats Cards (Clickable Filter Shortcuts) */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                        <button
                            onClick={() => { setPointFilter('all'); setCurrentPage(1); }}
                            className={`p-4 rounded-2xl text-left transition-all backdrop-blur border ${pointFilter === 'all' ? 'bg-white text-slate-900 shadow-lg ring-2 ring-white/50 border-white' : 'bg-white/15 text-white border-white/20 hover:bg-white/25'}`}
                        >
                            <div className="text-3xl font-extrabold">{countAll}</div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">Total Siswa Terdaftar</div>
                        </button>

                        <button
                            onClick={() => { setPointFilter('has_points'); setCurrentPage(1); }}
                            className={`p-4 rounded-2xl text-left transition-all backdrop-blur border ${pointFilter === 'has_points' ? 'bg-white text-amber-900 shadow-lg ring-2 ring-amber-400 border-amber-300' : 'bg-amber-500/25 text-white border-amber-300/30 hover:bg-amber-500/40'}`}
                        >
                            <div className="text-3xl font-extrabold flex items-center justify-between">
                                {countHasPoints}
                                <AlertTriangle className="w-5 h-5 text-amber-300" />
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">Ada Poin Pelanggaran</div>
                        </button>

                        <button
                            onClick={() => { setPointFilter('kritis'); setCurrentPage(1); }}
                            className={`p-4 rounded-2xl text-left transition-all backdrop-blur border ${pointFilter === 'kritis' ? 'bg-white text-rose-950 shadow-lg ring-2 ring-rose-500 border-rose-400' : 'bg-rose-900/40 text-white border-rose-400/40 hover:bg-rose-900/60'}`}
                        >
                            <div className="text-3xl font-extrabold flex items-center justify-between">
                                {countKritis}
                                <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-extrabold">≥50</span>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">Poin Kritis (≥50)</div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari berdasarkan nama siswa atau NIS..."
                            className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-300 bg-white shadow-sm text-slate-800 text-sm font-medium outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => { setSearch(""); router.push("/pelanggaran") }}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition shadow-sm shrink-0"
                    >
                        Cari
                    </button>
                </form>

                {/* GROUPING & FILTER TABS BAR */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                            <Filter className="w-4 h-4 text-red-600" />
                            <span>Kelompokkan Poin Pelanggaran:</span>
                        </div>
                        {(pointFilter !== 'all' || selectedClass !== 'all' || sortBy !== 'points_desc' || searchQuery) && (
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reset Semua Filter
                            </button>
                        )}
                    </div>

                    {/* Point Severity Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => { setPointFilter('all'); setCurrentPage(1); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${pointFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            <span>Semua Siswa</span>
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-700 text-white">{countAll}</span>
                        </button>

                        <button
                            onClick={() => { setPointFilter('has_points'); setCurrentPage(1); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${pointFilter === 'has_points' ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'}`}
                        >
                            <span>Ada Pelanggaran (&gt;0 Poin)</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${pointFilter === 'has_points' ? 'bg-red-800 text-white' : 'bg-red-200 text-red-800'}`}>{countHasPoints}</span>
                        </button>

                        <button
                            onClick={() => { setPointFilter('ringan'); setCurrentPage(1); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${pointFilter === 'ringan' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'}`}
                        >
                            <span>Pelanggaran Ringan (1-24)</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${pointFilter === 'ringan' ? 'bg-amber-800 text-white' : 'bg-amber-200 text-amber-900'}`}>{countRingan}</span>
                        </button>

                        <button
                            onClick={() => { setPointFilter('sedang'); setCurrentPage(1); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${pointFilter === 'sedang' ? 'bg-orange-600 text-white shadow-sm' : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200'}`}
                        >
                            <span>Pelanggaran Sedang (25-49)</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${pointFilter === 'sedang' ? 'bg-orange-800 text-white' : 'bg-orange-200 text-orange-900'}`}>{countSedang}</span>
                        </button>

                        <button
                            onClick={() => { setPointFilter('kritis'); setCurrentPage(1); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${pointFilter === 'kritis' ? 'bg-rose-700 text-white shadow-sm' : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300'}`}
                        >
                            <span>Poin Kritis (≥50) ⚠️</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${pointFilter === 'kritis' ? 'bg-rose-950 text-white' : 'bg-rose-200 text-rose-900'}`}>{countKritis}</span>
                        </button>

                        <button
                            onClick={() => { setPointFilter('clean'); setCurrentPage(1); }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${pointFilter === 'clean' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'}`}
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Bebas Pelanggaran (0 Poin)</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${pointFilter === 'clean' ? 'bg-emerald-800 text-white' : 'bg-emerald-200 text-emerald-900'}`}>{countClean}</span>
                        </button>
                    </div>

                    {/* Secondary Filters: Class & Sorting */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                        {/* Filter Kelas */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-600 shrink-0">Filter Kelas:</span>
                            <select
                                value={selectedClass}
                                onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
                                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-red-600"
                            >
                                <option value="all">Semua Kelas ({students.length} Siswa)</option>
                                {availableClasses.map(cls => (
                                    <option key={cls} value={cls}>
                                        Kelas {cls} ({students.filter(s => s.class === cls).length} Siswa)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Urutkan Data */}
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-600 shrink-0">Urutkan:</span>
                            <select
                                value={sortBy}
                                onChange={(e: any) => setSortBy(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-red-600"
                            >
                                <option value="points_desc">Poin Pelanggaran (Tertinggi → Terendah)</option>
                                <option value="points_asc">Poin Pelanggaran (Terendah → Tertinggi)</option>
                                <option value="name_asc">Nama Siswa (A - Z)</option>
                                <option value="class_asc">Kelas (A - Z)</option>
                            </select>
                        </div>

                        {/* Items Per Page Select */}
                        <div className="flex items-center gap-2 justify-end sm:col-span-2 lg:col-span-1">
                            <span className="text-xs font-bold text-slate-600 shrink-0">Tampilkan per hal:</span>
                            <select
                                value={itemsPerPage}
                                onChange={e => {
                                    setItemsPerPage(Number(e.target.value))
                                    setCurrentPage(1)
                                }}
                                className="rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-red-600"
                            >
                                <option value={10}>10 siswa</option>
                                <option value={20}>20 siswa</option>
                                <option value={50}>50 siswa</option>
                                <option value={100}>100 siswa</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Teacher Mode Banner */}
                {teacherMode && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900 shadow-xs">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span><strong>Mode Guru Aktif</strong> — Anda dapat mencatat poin &amp; pelanggaran siswa menggunakan tombol "Catat" pada baris siswa.</span>
                    </div>
                )}

                {/* Status Summary & Filter Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 font-medium">
                    <div>
                        Menampilkan <span className="font-bold text-slate-900">{filteredStudents.length}</span> dari total <span className="font-bold text-slate-900">{students.length}</span> siswa terdaftar.
                    </div>
                    {pointFilter !== 'all' && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 font-bold">
                            <span>Filter Aktif:</span>
                            <span className="uppercase text-[11px]">
                                {pointFilter === 'has_points' && 'Ada Pelanggaran (>0 Poin)'}
                                {pointFilter === 'ringan' && 'Pelanggaran Ringan (1-24 Poin)'}
                                {pointFilter === 'sedang' && 'Pelanggaran Sedang (25-49 Poin)'}
                                {pointFilter === 'kritis' && 'Poin Kritis (≥50 Poin)'}
                                {pointFilter === 'clean' && 'Bebas Pelanggaran (0 Poin)'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 bg-slate-100/80 border-b border-slate-200 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                        <div>NIS</div>
                        <div className="col-span-2">Nama Siswa &amp; Poin Pelanggaran</div>
                        <div className="text-center">Kelas</div>
                        <div className="text-right">Aksi / Catatan</div>
                    </div>

                    {paginatedStudents.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 bg-white">
                            <ShieldAlert className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <p className="font-bold text-slate-700 text-base">Tidak Ada Siswa pada Kelompok Ini</p>
                            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan filter atau pilih kelompok siswa lainnya.</p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition"
                            >
                                Tampilkan Semua Siswa
                            </button>
                        </div>
                    ) : (
                        paginatedStudents.map((student, idx) => {
                            const badge = getPointsBadge(student.totalPoints)
                            return (
                                <div
                                    key={student.id}
                                    className={`grid grid-cols-5 items-center px-5 py-4 hover:bg-slate-50 transition-colors ${idx < paginatedStudents.length - 1 ? "border-b border-slate-100" : ""}`}
                                >
                                    <div className="text-xs font-mono font-semibold text-slate-500">{student.nis}</div>
                                    <div className="col-span-2 flex items-center gap-3.5">
                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-xs ${student.totalPoints >= 50 ? 'bg-rose-600' : student.totalPoints >= 25 ? 'bg-orange-500' : student.totalPoints > 0 ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-tight">{student.name}</p>
                                            <span className={`inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                                            {student.class}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/pelanggaran/${student.id}`}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            Detail Poin
                                        </Link>
                                        {teacherMode && (
                                            <Link
                                                href={`/pelanggaran/${student.id}#catat`}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-xs"
                                            >
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                Catat
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}

                    {/* Pagination Footer */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4">
                            <div className="text-xs font-medium text-slate-600">
                                Menampilkan <span className="font-bold text-slate-900">{startIndex + 1}</span> - <span className="font-bold text-slate-900">{Math.min(endIndex, filteredStudents.length)}</span> dari <span className="font-bold text-slate-900">{filteredStudents.length}</span> siswa terfilter
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 disabled:pointer-events-none shadow-xs"
                                >
                                    Sebelumnya
                                </button>
                                
                                {getPageNumbers().map((pageNum, idx) => {
                                    if (pageNum === '...') {
                                        return (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-xs">
                                                ...
                                            </span>
                                        )
                                    }
                                    
                                    const isActive = pageNum === currentPage
                                    return (
                                        <button
                                            key={`page-${pageNum}`}
                                            onClick={() => setCurrentPage(Number(pageNum))}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                                                isActive
                                                    ? "bg-red-600 text-white"
                                                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 disabled:pointer-events-none shadow-xs"
                                >
                                    Berikutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Teacher Mode Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <Lock className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Mode Guru</h2>
                                    <p className="text-xs text-slate-500">Masukkan kode akses untuk mencatat pelanggaran</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowModal(false); setError(""); setAccessKey("") }} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAccessKey} className="space-y-4">
                            {error && (
                                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                    Kode Akses Guru
                                </label>
                                <input
                                    type="password"
                                    value={accessKey}
                                    onChange={e => setAccessKey(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    autoFocus
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 transition disabled:opacity-60 shadow-md"
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
