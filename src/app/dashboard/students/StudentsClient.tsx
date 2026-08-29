'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { RefreshCw, Plus, Pencil, ShieldAlert, Upload, TrendingUp, CalendarDays,
    Printer, Search, Layers, List, Users, Download, ChevronLeft, ChevronRight,
    School, AlertTriangle, CheckCircle2, Filter
} from "lucide-react"
import DeleteStudentButton from "./DeleteStudentButton"
import { fixSwappedStudentNisAndName } from "@/actions/student"

type Student = {
    id: number
    nis: string
    name: string
    class: string
    status: string
    totalPoints: number
}

const STATUS_COLORS: Record<string, string> = {
    AKTIF: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LULUS: 'bg-purple-50 text-purple-700 border-purple-200',
    KELUAR: 'bg-red-50 text-red-700 border-red-200',
}

export default function StudentsClient({
    students,
    currentStatus,
}: {
    students: Student[]
    currentStatus: string
}) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedClass, setSelectedClass] = useState<string>('ALL')
    const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped')
    const [pageSize, setPageSize] = useState<number>(25)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isFixing, setIsFixing] = useState(false)

    const handleFixSwappedData = async () => {
        if (!confirm("Apakah Anda yakin ingin memeriksa dan membalikkan data NIS dan Nama siswa yang terbalik?")) return
        setIsFixing(true)
        const res = await fixSwappedStudentNisAndName()
        setIsFixing(false)
        if (res.error) {
            alert(res.error)
        } else if (res.message) {
            alert(res.message)
            window.location.reload()
        }
    }

    // Extract unique classes list
    const availableClasses = useMemo(() => {
        const set = new Set(students.map(s => s.class))
        return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    }, [students])

    // KPI Metrics calculation
    const metrics = useMemo(() => {
        const total = students.length
        const aktif = students.filter(s => s.status === 'AKTIF').length
        const classCount = availableClasses.length
        const totalViolations = students.reduce((sum, s) => sum + (s.totalPoints || 0), 0)
        return { total, aktif, classCount, totalViolations }
    }, [students, availableClasses])

    // Filter students by search query & class filter
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesQuery = !searchQuery.trim() || (
                s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                s.nis.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                s.class.toLowerCase().includes(searchQuery.toLowerCase().trim())
            )
            const matchesClass = selectedClass === 'ALL' || s.class === selectedClass
            return matchesQuery && matchesClass
        })
    }, [students, searchQuery, selectedClass])

    // Group students by class
    const groupedByClass = useMemo(() => {
        const map = new Map<string, Student[]>()
        filteredStudents.forEach(s => {
            const cls = s.class || 'Tanpa Kelas'
            if (!map.has(cls)) map.set(cls, [])
            map.get(cls)!.push(s)
        })

        return Array.from(map.entries()).sort(([a], [b]) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        })
    }, [filteredStudents])

    // Pagination calculations (for Flat view)
    const totalPages = Math.ceil(filteredStudents.length / (pageSize === 0 ? filteredStudents.length || 1 : pageSize))
    const paginatedStudents = useMemo(() => {
        if (pageSize === 0) return filteredStudents
        const start = (currentPage - 1) * pageSize
        return filteredStudents.slice(start, start + pageSize)
    }, [filteredStudents, currentPage, pageSize])

    const handlePrint = () => {
        window.print()
    }

    // Export CSV handler
    const handleExportCSV = () => {
        const headers = ["No", "NIS", "Nama Siswa", "Kelas", "Status", "Poin Pelanggaran"]
        const rows = filteredStudents.map((s, idx) => [
            idx + 1,
            `"${s.nis}"`,
            `"${s.name.replace(/"/g, '""')}"`,
            `"${s.class}"`,
            `"${s.status}"`,
            s.totalPoints || 0
        ])

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `data_siswa_${currentStatus.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            {/* Styles for print output & page breaks */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm 15mm 15mm 15mm;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .no-print,
                    header,
                    aside,
                    nav,
                    .sidebar {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    .print-page-break {
                        break-before: page !important;
                        page-break-before: always !important;
                    }
                    .print-container {
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .print-table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }
                    .print-table th, .print-table td {
                        border: 1px solid #cbd5e1 !important;
                        padding: 6px 10px !important;
                        font-size: 11pt !important;
                    }
                    .print-table th {
                        background-color: #f1f5f9 !important;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            {/* Print Header (Only visible on paper / PDF) */}
            <div className="print-only mb-6 text-center border-b-2 border-gray-800 pb-4">
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">MADRASAH TSANAWIYAH</h2>
                <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mt-1">DAFTAR LAPORAN DATA SISWA</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Status: <span className="font-bold text-black">{currentStatus}</span> | Total Siswa: <span className="font-bold text-black">{filteredStudents.length}</span> | Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Top Bar Header & Action Buttons (Hidden on Print) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm no-print">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">Manajemen Data Siswa</h4>
                        <p className="text-sm text-gray-500">Kelola data master siswa, pengelompokan kelas, dan laporan</p>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black transition shadow-sm"
                        title="Unduh data dalam format CSV"
                    >
                        <Download className="h-4 w-4 text-emerald-600" />
                        Export CSV
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black transition shadow-sm"
                    >
                        <Printer className="h-4 w-4 text-blue-600" />
                        Cetak Laporan
                    </button>
                    <Link
                        href="/dashboard/students/academic-years"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black transition shadow-sm"
                    >
                        <CalendarDays className="h-4 w-4 text-indigo-600" />
                        Tahun Pelajaran
                    </Link>
                    <Link
                        href="/dashboard/students/promote"
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 py-2 px-3.5 text-sm font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
                    >
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        Kenaikan Kelas
                    </Link>
                    <button
                        type="button"
                        onClick={handleFixSwappedData}
                        disabled={isFixing}
                        className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 py-2 px-3.5 text-sm font-bold text-amber-800 hover:bg-amber-100 transition shadow-sm disabled:opacity-50"
                        title="Tukar data NIS dan Nama siswa jika saat impor tersimpan terbalik"
                    >
                        <RefreshCw className={`h-4 w-4 text-amber-600 ${isFixing ? 'animate-spin' : ''}`} />
                        {isFixing ? 'Memperbaiki...' : 'Perbaiki NIS & Nama Terbalik'}
                    </button>
                    <Link
                        href="/dashboard/students/import"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white py-2 px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black transition shadow-sm"
                    >
                        <Upload className="h-4 w-4 text-purple-600" />
                        Impor Excel
                    </Link>
                    <Link
                        href="/dashboard/students/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 py-2 px-4 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-md"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Siswa
                    </Link>
                </div>
            </div>

            {/* KPI Metrics Cards Overview (Hidden on Print) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 no-print">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">{metrics.total}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Siswa</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-emerald-700">{metrics.aktif}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Siswa Aktif</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-bold">
                        <School className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-purple-700">{metrics.classCount}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah Kelas</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-amber-700">{metrics.totalViolations}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Poin Pelanggaran</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm print-container">
                {/* Status Tabs, Dropdown Class Filter & Search Bar (Hidden on Print) */}
                <div className="space-y-4 mb-6 no-print">
                    {/* Status Filter Tabs & View Selector */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                        {/* Status Filter Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-1 lg:pb-0">
                            {[
                                { label: 'Aktif', value: 'AKTIF' },
                                { label: 'Lulus', value: 'LULUS' },
                                { label: 'Keluar', value: 'KELUAR' },
                                { label: 'Semua Status', value: 'SEMUA' },
                            ].map(tab => (
                                <Link
                                    key={tab.value}
                                    href={`/dashboard/students?status=${tab.value}`}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                                        currentStatus === tab.value
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {tab.label}
                                </Link>
                            ))}
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start lg:self-auto">
                            <button
                                type="button"
                                onClick={() => setViewMode('grouped')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                                    viewMode === 'grouped' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <Layers className="h-3.5 w-3.5" /> Per Kelas
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('flat')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                                    viewMode === 'flat' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <List className="h-3.5 w-3.5" /> Daftar Tunggal
                            </button>
                        </div>
                    </div>

                    {/* Class Filter Dropdown Component */}
                    {availableClasses.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                <label htmlFor="class-filter-select" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Filter Kelas:
                                </label>
                            </div>
                            <select
                                id="class-filter-select"
                                value={selectedClass}
                                onChange={e => { setSelectedClass(e.target.value); setCurrentPage(1); }}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition min-w-[220px]"
                            >
                                <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
                                {availableClasses.map(cls => {
                                    const classStudentsCount = students.filter(s => s.class === cls).length
                                    return (
                                        <option key={cls} value={cls}>
                                            Kelas {cls} ({classStudentsCount} Siswa)
                                        </option>
                                    )
                                })}
                            </select>
                            {selectedClass !== 'ALL' && (
                                <button
                                    type="button"
                                    onClick={() => { setSelectedClass('ALL'); setCurrentPage(1); }}
                                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                                >
                                    Reset Filter Kelas
                                </button>
                            )}
                        </div>
                    )}

                    {/* Search Input Bar & Pagination Size Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan NIS, nama, atau kelas..."
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
                                >
                                    Bersihkan
                                </button>
                            )}
                        </div>

                        {viewMode === 'flat' && (
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <span className="text-xs text-gray-500 font-medium">Tampilkan:</span>
                                <select
                                    value={pageSize}
                                    onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                    className="rounded-lg border border-gray-300 text-xs px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                                >
                                    <option value={10}>10 baris</option>
                                    <option value={25}>25 baris</option>
                                    <option value={50}>50 baris</option>
                                    <option value={100}>100 baris</option>
                                    <option value={0}>Semua Data</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 rounded-lg border border-dashed border-gray-300">
                        <ShieldAlert className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h5 className="font-semibold text-gray-800 text-base">Tidak ada data siswa</h5>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchQuery ? `Tidak ditemukan siswa yang cocok dengan "${searchQuery}".` : `Tidak ada siswa dengan status ${currentStatus.toLowerCase()}.`}
                        </p>
                    </div>
                ) : viewMode === 'grouped' ? (
                    /* GROUPED BY CLASS VIEW */
                    <div className="space-y-8">
                        {groupedByClass.map(([className, classStudents], classIdx) => (
                            <div
                                key={className}
                                className={`${classIdx > 0 ? 'print-page-break' : ''} space-y-3`}
                            >
                                {/* Class Group Header */}
                                <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 rounded-xl shadow-sm print:bg-gray-100 print:text-black print:border print:border-gray-300">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm font-black bg-emerald-500 text-slate-950 px-3 py-1 rounded-lg print:border print:border-gray-400">
                                            Kelas {className}
                                        </span>
                                        <span className="text-sm text-slate-300 print:text-gray-700 font-semibold">
                                            ({classStudents.length} siswa)
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono no-print">
                                        Data Terurut NIS & Nama
                                    </span>
                                </div>

                                {/* Table per Class */}
                                <div className="overflow-x-auto rounded-xl border border-gray-200 print-table-container">
                                    <table className="w-full text-sm text-left print-table">
                                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold w-12 text-center">No</th>
                                                <th className="px-4 py-3 font-semibold w-32">NIS</th>
                                                <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                                                <th className="px-4 py-3 font-semibold text-center w-36">Poin Pelanggaran</th>
                                                <th className="px-4 py-3 font-semibold text-center w-28">Status</th>
                                                <th className="px-4 py-3 font-semibold text-center w-24 no-print">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {classStudents.map((student, idx) => (
                                                <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="px-4 py-3 text-center text-xs font-mono text-gray-400">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono font-medium text-gray-700">
                                                        {student.nis}
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-gray-900">
                                                        {student.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                                                            student.totalPoints === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            student.totalPoints < 20 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                            {student.totalPoints || 0} Pts
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[student.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                            {student.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center no-print">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <Link
                                                                href={`/dashboard/students/${student.id}/edit`}
                                                                className="text-gray-500 hover:text-emerald-600 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            <DeleteStudentButton studentId={student.id} studentName={student.name} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* FLAT TABLE VIEW WITH PAGINATION */
                    <div className="space-y-4">
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-sm text-left print-table">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold w-12 text-center">No</th>
                                        <th className="px-4 py-3 font-semibold w-32">NIS</th>
                                        <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                                        <th className="px-4 py-3 font-semibold text-center w-24">Kelas</th>
                                        <th className="px-4 py-3 font-semibold text-center w-36">Poin Pelanggaran</th>
                                        <th className="px-4 py-3 font-semibold text-center w-28">Status</th>
                                        <th className="px-4 py-3 font-semibold text-center w-24 no-print">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedStudents.map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-4 py-3 text-center text-xs font-mono text-gray-400">
                                                {pageSize === 0 ? idx + 1 : (currentPage - 1) * pageSize + idx + 1}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-medium text-gray-700">
                                                {student.nis}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-gray-900">
                                                {student.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono px-2.5 py-0.5 rounded">
                                                    {student.class}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                                                    student.totalPoints === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    student.totalPoints < 20 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                    {student.totalPoints || 0} Pts
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[student.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center no-print">
                                                <div className="flex items-center justify-center gap-3">
                                                    <Link
                                                        href={`/dashboard/students/${student.id}/edit`}
                                                        className="text-gray-500 hover:text-emerald-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    <DeleteStudentButton studentId={student.id} studentName={student.name} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar (Flat View) */}
                        {pageSize > 0 && totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 no-print">
                                <div className="text-xs text-gray-500 font-medium">
                                    Menampilkan {Math.min((currentPage - 1) * pageSize + 1, filteredStudents.length)} - {Math.min(currentPage * pageSize, filteredStudents.length)} dari {filteredStudents.length} siswa
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                                                currentPage === page
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Count Summary */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <div>
                        Total Siswa Ditemukan: <span className="font-bold text-black">{filteredStudents.length}</span>
                        {selectedClass !== 'ALL' ? ` (Kelas ${selectedClass})` : ''}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                        {groupedByClass.length} Kelompok Kelas
                    </div>
                </div>
            </div>
        </div>
    )
}
