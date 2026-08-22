'use client'

import { useState, useTransition, useMemo } from "react"
import { promoteStudents } from "@/actions/academic-year"
import Link from "next/link"
import {
    ArrowLeft, TrendingUp, GraduationCap, AlertTriangle,
    CheckCircle2, ArrowRight, Users, BookOpen, Settings2, RotateCcw,
    Printer, Download, Search, Filter, ShieldAlert, Sparkles
} from "lucide-react"

type AcademicYear = {
    id: number
    name: string
    isActive: boolean
    _count: { classHistory: number }
}

type Student = {
    id: number
    nis: string
    name: string
    class: string
    status: string
    totalPoints: number
}

type ExceptionStatus = 'TIDAK_NAIK' | 'KELUAR'
type StepId = 'config' | 'preview' | 'result'

function parseGradeLevel(cls: string): string {
    if (!cls) return 'OTHER'
    const trimmed = cls.trim().toUpperCase()
    if (trimmed.startsWith('9') || trimmed.startsWith('IX') || trimmed.includes('9') || trimmed.includes('IX')) return '9'
    if (trimmed.startsWith('8') || trimmed.startsWith('VIII') || trimmed.includes('8') || trimmed.includes('VIII')) return '8'
    if (trimmed.startsWith('7') || trimmed.startsWith('VII') || trimmed.includes('7') || trimmed.includes('VII')) return '7'
    
    // Check first digit if available
    const match = trimmed.match(/\d/)
    if (match) return match[0]
    return 'OTHER'
}

function suggestDestinationClass(cls: string): string {
    const level = parseGradeLevel(cls)
    if (level === '9') return 'ALUMNI'
    
    if (level === '7') {
        if (cls.includes('VII')) return cls.replace(/VII/ig, 'VIII')
        if (cls.includes('7')) return cls.replace('7', '8')
        return `8${cls}`
    }
    if (level === '8') {
        if (cls.includes('VIII')) return cls.replace(/VIII/ig, 'IX')
        if (cls.includes('8')) return cls.replace('8', '9')
        return `9${cls}`
    }
    return ''
}

function getDefaultMapping(classes: string[]): Record<string, string> {
    const mapping: Record<string, string> = {}
    classes.forEach(cls => {
        const level = parseGradeLevel(cls)
        if (level !== '9') {
            mapping[cls] = suggestDestinationClass(cls)
        }
    })
    return mapping
}

const statusColor: Record<string, string> = {
    'NAIK': 'bg-blue-50 text-blue-700 border-blue-200',
    'LULUS': 'bg-purple-50 text-purple-700 border-purple-200',
    'TIDAK_NAIK': 'bg-orange-50 text-orange-700 border-orange-200',
    'KELUAR': 'bg-red-50 text-red-700 border-red-200',
    'PERLU_KONFIGURASI': 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

const statusLabel: Record<string, string> = {
    'NAIK': 'Naik Kelas',
    'LULUS': '→ Alumni',
    'TIDAK_NAIK': 'Tidak Naik',
    'KELUAR': 'Keluar',
    'PERLU_KONFIGURASI': 'Perlu Dikonfigurasi',
}

export default function PromoteClient({ years, students }: { years: AcademicYear[], students: Student[] }) {
    const [step, setStep] = useState<StepId>('config')
    const [selectedYearId, setSelectedYearId] = useState<number | null>(years.find(y => y.isActive)?.id ?? years[0]?.id ?? null)
    const [exceptions, setExceptions] = useState<Record<number, ExceptionStatus>>({})
    const [isPending, startTransition] = useTransition()
    const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string; stats?: Record<string, number> } | null>(null)
    const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL')
    const [searchQuery, setSearchQuery] = useState<string>('')

    // Derive unique class names from active students
    const uniqueClasses = useMemo(() => {
        const set = new Set(students.map(s => s.class))
        return Array.from(set).sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        })
    }, [students])

    const [classMapping, setClassMapping] = useState<Record<string, string>>(() => getDefaultMapping(uniqueClasses))

    // Handle Auto-fill Suggestion All Mappings
    const handleAutoFillMapping = () => {
        const suggested = getDefaultMapping(uniqueClasses)
        setClassMapping(prev => ({ ...prev, ...suggested }))
    }

    // Compute preview data
    const previewData = useMemo(() => {
        return students.map(s => {
            const exc = exceptions[s.id]
            const isGraduating = parseGradeLevel(s.class) === '9'
            let action: string
            let newClass: string

            if (exc) {
                action = exc
                newClass = exc === 'TIDAK_NAIK' ? s.class : '-'
            } else if (isGraduating) {
                action = 'LULUS'
                newClass = 'ALUMNI'
            } else {
                const mapped = classMapping[s.class]?.trim()
                action = mapped ? 'NAIK' : 'PERLU_KONFIGURASI'
                newClass = mapped ?? '?'
            }

            return { ...s, action, newClass }
        })
    }, [students, classMapping, exceptions])

    // Filter preview data by class filter & search query
    const filteredPreviewData = useMemo(() => {
        return previewData.filter(s => {
            const matchesClass = selectedClassFilter === 'ALL' || s.class === selectedClassFilter
            const matchesQuery = !searchQuery.trim() || (
                s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                s.nis.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                s.class.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                s.newClass.toLowerCase().includes(searchQuery.toLowerCase().trim())
            )
            return matchesClass && matchesQuery
        })
    }, [previewData, selectedClassFilter, searchQuery])

    // Group preview data by original class
    const previewGroupedByClass = useMemo(() => {
        const map = new Map<string, typeof filteredPreviewData>()
        filteredPreviewData.forEach(s => {
            const cls = s.class || 'Tanpa Kelas'
            if (!map.has(cls)) map.set(cls, [])
            map.get(cls)!.push(s)
        })

        return Array.from(map.entries()).sort(([a], [b]) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        })
    }, [filteredPreviewData])

    // Group students for exception config step (filtered by class dropdown)
    const exceptionStudentsGrouped = useMemo(() => {
        const nonGraduating = students.filter(s => parseGradeLevel(s.class) !== '9')
        const filtered = nonGraduating.filter(s => selectedClassFilter === 'ALL' || s.class === selectedClassFilter)
        
        const map = new Map<string, Student[]>()
        filtered.forEach(s => {
            const cls = s.class || 'Tanpa Kelas'
            if (!map.has(cls)) map.set(cls, [])
            map.get(cls)!.push(s)
        })
        return Array.from(map.entries()).sort(([a], [b]) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        })
    }, [students, selectedClassFilter])

    const stats = useMemo(() => ({
        total: previewData.length,
        naik: previewData.filter(s => s.action === 'NAIK').length,
        lulus: previewData.filter(s => s.action === 'LULUS').length,
        tidakNaik: previewData.filter(s => s.action === 'TIDAK_NAIK').length,
        keluar: previewData.filter(s => s.action === 'KELUAR').length,
        perluKonfig: previewData.filter(s => s.action === 'PERLU_KONFIGURASI').length,
    }), [previewData])

    const unmappedClassesCount = useMemo(() => {
        return uniqueClasses.filter(c => parseGradeLevel(c) !== '9' && !classMapping[c]?.trim()).length
    }, [uniqueClasses, classMapping])

    const canProceed = stats.perluKonfig === 0 && selectedYearId !== null

    const handleExecute = () => {
        if (!selectedYearId) return
        if (!confirm(`Proses kenaikan kelas akan:\n• Menaikkan ${stats.naik} siswa\n• Meluluskan ${stats.lulus} siswa (jadi alumni)\n• ${stats.tidakNaik} siswa tidak naik\n• ${stats.keluar} siswa keluar\n\nSemua pelanggaran siswa yang naik/lulus akan DIHAPUS.\n\nLanjutkan?`)) return

        startTransition(async () => {
            const res = await promoteStudents(selectedYearId, classMapping, exceptions)
            setResult(res)
            setStep('result')
        })
    }

    const handlePrintPreview = () => {
        window.print()
    }

    const handleExportCSV = () => {
        const headers = ["No", "NIS", "Nama Siswa", "Kelas Asal", "Kelas Baru / Tujuan", "Status Kenaikan"]
        const rows = filteredPreviewData.map((s, idx) => [
            idx + 1,
            `"${s.nis}"`,
            `"${s.name.replace(/"/g, '""')}"`,
            `"${s.class}"`,
            `"${s.newClass}"`,
            `"${statusLabel[s.action] ?? s.action}"`
        ])

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `preview_kenaikan_kelas_${new Date().toISOString().slice(0,10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const selectedYear = years.find(y => y.id === selectedYearId)

    if (step === 'result') {
        return (
            <div className="rounded-xl border border-gray-200 bg-white px-5 pt-6 pb-6 shadow-sm sm:px-7.5">
                <div className="flex items-center gap-3 mb-8">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${result?.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {result?.success ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <AlertTriangle className="h-6 w-6 text-red-600" />}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">{result?.success ? 'Kenaikan Kelas Selesai!' : 'Proses Gagal'}</h4>
                        <p className="text-sm text-gray-500">{result?.message ?? result?.error}</p>
                    </div>
                </div>

                {result?.success && result.stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Naik Kelas', value: result.stats.promoted, color: 'blue' },
                            { label: 'Lulus/Alumni', value: result.stats.graduated, color: 'purple' },
                            { label: 'Exception', value: result.stats.exceptional, color: 'orange' },
                            { label: 'Dilewati', value: result.stats.skipped, color: 'gray' },
                        ].map(item => (
                            <div key={item.label} className={`rounded-xl border p-4 text-center bg-${item.color}-50 border-${item.color}-100`}>
                                <div className={`text-3xl font-black text-${item.color}-700`}>{item.value}</div>
                                <div className={`text-xs font-semibold text-${item.color}-600 uppercase tracking-wider mt-1`}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3">
                    <Link href="/dashboard/students"
                        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm">
                        Lihat Data Siswa
                    </Link>
                    <Link href="/dashboard/alumni"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                        Lihat Data Alumni
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Print Styles & Page Break Setup */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm;
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
                        font-size: 10pt !important;
                    }
                    .print-table th {
                        background-color: #f1f5f9 !important;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            {/* Print Header */}
            <div className="print-only mb-6 text-center border-b-2 border-gray-800 pb-4">
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">MADRASAH TSANAWIYAH</h2>
                <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mt-1">DAFTAR LAPORAN PREVIEW KENAIKAN KELAS</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Tahun Pelajaran Tujuan: <span className="font-bold text-black">{selectedYear?.name}</span> | Total Siswa: <span className="font-bold text-black">{stats.total}</span> | Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm print-container">
                {/* Header (Hidden on Print) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 no-print">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/students" className="text-gray-500 hover:text-black transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900">Proses Kenaikan Kelas</h4>
                            <p className="text-sm text-gray-500">Pemetaan otomatis & kenaikan kelas siswa MTs</p>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 text-sm">
                        <button onClick={() => setStep('config')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${step === 'config' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                            <Settings2 className="h-4 w-4" /> 1. Konfigurasi
                        </button>
                        <ArrowRight className="h-4 w-4 text-gray-300" />
                        <button onClick={() => stats.perluKonfig === 0 && setStep('preview')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${step === 'preview' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-gray-400'} ${stats.perluKonfig === 0 ? 'hover:text-gray-800 cursor-pointer' : 'cursor-not-allowed'}`}>
                            <Users className="h-4 w-4" /> 2. Preview
                        </button>
                        <ArrowRight className="h-4 w-4 text-gray-300" />
                        <span className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400">
                            <CheckCircle2 className="h-4 w-4" /> 3. Selesai
                        </span>
                    </div>
                </div>

                {/* Stats KPI Overview Bar (Hidden on Print) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6 no-print">
                    {[
                        { label: 'Naik Kelas', value: stats.naik, icon: TrendingUp, color: 'blue' },
                        { label: 'Lulus → Alumni', value: stats.lulus, icon: GraduationCap, color: 'purple' },
                        { label: 'Tidak Naik', value: stats.tidakNaik, icon: RotateCcw, color: 'orange' },
                        { label: 'Keluar', value: stats.keluar, icon: AlertTriangle, color: 'red' },
                        { label: 'Perlu Konfigurasi', value: stats.perluKonfig, icon: Settings2, color: stats.perluKonfig > 0 ? 'yellow' : 'gray' },
                    ].map(item => (
                        <div key={item.label} className={`rounded-xl border p-3.5 text-center shadow-xs ${item.color === 'blue' ? 'bg-blue-50 border-blue-100' : item.color === 'purple' ? 'bg-purple-50 border-purple-100' : item.color === 'orange' ? 'bg-orange-50 border-orange-100' : item.color === 'red' ? 'bg-red-50 border-red-100' : item.color === 'yellow' ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className={`text-2xl font-black ${item.color === 'blue' ? 'text-blue-700' : item.color === 'purple' ? 'text-purple-700' : item.color === 'orange' ? 'text-orange-700' : item.color === 'red' ? 'text-red-700' : item.color === 'yellow' ? 'text-yellow-700' : 'text-gray-500'}`}>{item.value}</div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">{item.label}</div>
                        </div>
                    ))}
                </div>

                {step === 'config' && (
                    <div className="space-y-6">
                        {/* Step 1: Select Academic Year */}
                        <div className="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                            <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-emerald-600" />
                                Pilih Tahun Pelajaran Tujuan
                            </h5>
                            {years.length === 0 ? (
                                <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                                    Belum ada tahun pelajaran.{' '}
                                    <Link href="/dashboard/students/academic-years" className="font-bold underline">Buat baru di sini →</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {years.map(year => (
                                        <button
                                            key={year.id}
                                            type="button"
                                            onClick={() => setSelectedYearId(year.id)}
                                            className={`rounded-xl border-2 p-4 text-left transition ${selectedYearId === year.id ? 'border-emerald-600 bg-emerald-50 shadow-xs' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        >
                                            <div className="font-bold text-sm text-gray-900">{year.name}</div>
                                            {year.isActive && <div className="text-xs font-bold text-emerald-700 mt-0.5">★ Tahun Pelajaran Aktif</div>}
                                            <div className="text-xs text-gray-500 mt-1">{year._count.classHistory} riwayat tersimpan</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Step 2: Class Mapping Config */}
                        <div className="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div>
                                    <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Settings2 className="h-4 w-4 text-emerald-600" />
                                        Konfigurasi Pemetaan Kelas Tujuan
                                    </h5>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Siswa Kelas 9/IX otomatis → Alumni. Atur kelas tujuan untuk kelas lainnya.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAutoFillMapping}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs self-start sm:self-auto"
                                >
                                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                    Isi Pemetaan Otomatis
                                </button>
                            </div>

                            {['7', '8', 'OTHER'].map(level => {
                                const levelClasses = uniqueClasses.filter(c => parseGradeLevel(c) === level)
                                if (levelClasses.length === 0) return null
                                return (
                                    <div key={level} className="mb-5">
                                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                            {level === 'OTHER' ? 'Kelas Lainnya / Format Kustom' : `Kelas ${level}`}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {levelClasses.map(cls => (
                                                <div key={cls} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-gray-200">
                                                    <span className="rounded-md bg-blue-100 text-blue-800 px-2.5 py-1 text-xs font-mono font-bold w-16 text-center truncate" title={cls}>{cls}</span>
                                                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={classMapping[cls] ?? ''}
                                                        onChange={e => setClassMapping(prev => ({ ...prev, [cls]: e.target.value }))}
                                                        placeholder={`Kelas tujuan...`}
                                                        className={`flex-1 rounded-md border px-2.5 py-1 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!classMapping[cls] ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Kelas 9 info */}
                            {uniqueClasses.filter(c => parseGradeLevel(c) === '9').length > 0 && (
                                <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-2 flex items-center gap-1.5">
                                        <GraduationCap className="h-4 w-4" /> Kelas 9 / IX → Lulus → Alumni (Otomatis)
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueClasses.filter(c => parseGradeLevel(c) === '9').map(cls => (
                                            <span key={cls} className="rounded-md bg-purple-100 text-purple-900 px-2.5 py-1 text-xs font-mono font-bold">{cls}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Per-student exceptions (Grouped by Class & Filterable by Dropdown) */}
                        <div className="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div>
                                    <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        Pengecualian Per Siswa (Tidak Naik / Keluar)
                                    </h5>
                                    <p className="text-xs text-gray-500 mt-0.5">Tandai siswa yang tidak naik kelas atau keluar (opsional).</p>
                                </div>

                                {/* Class Dropdown Selector for Exception step */}
                                {uniqueClasses.length > 0 && (
                                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-2xs">
                                        <Filter className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                                        <select
                                            value={selectedClassFilter}
                                            onChange={e => setSelectedClassFilter(e.target.value)}
                                            className="rounded-md border border-gray-300 text-xs font-bold px-2.5 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="ALL">Semua Kelas ({students.filter(s => parseGradeLevel(s.class) !== '9').length} Siswa)</option>
                                            {uniqueClasses.filter(c => parseGradeLevel(c) !== '9').map(cls => (
                                                <option key={cls} value={cls}>Kelas {cls}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {exceptionStudentsGrouped.map(([cls, classStudents]) => (
                                    <div key={cls} className="space-y-2">
                                        <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg font-mono text-xs font-bold">
                                            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">Kelas {cls}</span>
                                            <span>({classStudents.length} siswa)</span>
                                        </div>
                                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                                                        <th className="text-left p-2.5 font-medium w-12 text-center">No</th>
                                                        <th className="text-left p-2.5 font-medium">Nama Siswa</th>
                                                        <th className="text-left p-2.5 font-medium w-32">NIS</th>
                                                        <th className="text-center p-2.5 font-medium w-48">Tindakan Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {classStudents.map((s, idx) => (
                                                        <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                            <td className="p-2.5 text-center text-xs font-mono text-gray-400">{idx + 1}</td>
                                                            <td className="p-2.5 font-bold text-gray-900">{s.name}</td>
                                                            <td className="p-2.5 font-mono text-gray-600 text-xs">{s.nis}</td>
                                                            <td className="p-2.5 text-center">
                                                                <select
                                                                    value={exceptions[s.id] ?? ''}
                                                                    onChange={e => {
                                                                        const val = e.target.value as ExceptionStatus | ''
                                                                        setExceptions(prev => {
                                                                            const next = { ...prev }
                                                                            if (val === '') delete next[s.id]
                                                                            else next[s.id] = val
                                                                            return next
                                                                        })
                                                                    }}
                                                                    className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-2xs"
                                                                >
                                                                    <option value="">Naik Kelas (Normal)</option>
                                                                    <option value="TIDAK_NAIK">Tidak Naik Kelas</option>
                                                                    <option value="KELUAR">Keluar</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next button */}
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href="/dashboard/students"
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                                Batal
                            </Link>
                            <button
                                onClick={() => setStep('preview')}
                                disabled={!canProceed}
                                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                            >
                                Lihat Preview Kenaikan <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                        {!canProceed && stats.perluKonfig > 0 && (
                            <p className="text-right text-xs text-amber-600 font-bold mt-1">
                                ⚠ Ada {stats.perluKonfig} siswa (dari {unmappedClassesCount} kelas) yang belum dikonfigurasi mapping-nya.
                            </p>
                        )}
                        {!canProceed && !selectedYearId && (
                            <p className="text-right text-xs text-red-600 font-bold mt-1">Pilih tahun pelajaran tujuan terlebih dahulu.</p>
                        )}
                    </div>
                )}

                {step === 'preview' && (
                    <div className="space-y-6">
                        {/* Control Bar: Class Filter Dropdown, Search Input, Export & Print */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 no-print">
                            <div className="flex flex-wrap items-center gap-3 flex-1">
                                {/* Class Dropdown Filter */}
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-2xs">
                                    <Filter className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                                    <label htmlFor="preview-class-filter" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Filter Kelas:
                                    </label>
                                    <select
                                        id="preview-class-filter"
                                        value={selectedClassFilter}
                                        onChange={e => setSelectedClassFilter(e.target.value)}
                                        className="rounded-md border border-gray-300 text-xs font-bold px-2.5 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="ALL">Semua Kelas ({stats.total} Siswa)</option>
                                        {uniqueClasses.map(cls => (
                                            <option key={cls} value={cls}>Kelas {cls}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Bar */}
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari NIS / Nama..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">×</button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end xl:self-auto">
                                <button
                                    type="button"
                                    onClick={handleExportCSV}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                                >
                                    <Download className="h-3.5 w-3.5 text-emerald-600" />
                                    Export CSV
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrintPreview}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                                >
                                    <Printer className="h-3.5 w-3.5 text-blue-600" />
                                    Cetak Preview
                                </button>
                            </div>
                        </div>

                        {/* Warning Box */}
                        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3 no-print">
                            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <strong>Tinjau data sebelum melanjutkan.</strong> Proses ini akan mengubah kelas {stats.naik + stats.lulus} siswa, membuat {stats.lulus} entri alumni baru, dan menghapus semua riwayat pelanggaran siswa yang naik/lulus. Tahun pelajaran tujuan: <strong>{selectedYear?.name}</strong>.
                            </div>
                        </div>

                        {/* PREVIEW GROUPED BY CLASS WITH PRINT PAGE BREAKS */}
                        {previewGroupedByClass.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 border border-dashed rounded-xl">
                                <ShieldAlert className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                                <p className="font-semibold text-sm">Tidak ada siswa yang sesuai filter.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {previewGroupedByClass.map(([clsName, classPreview], classIdx) => (
                                    <div
                                        key={clsName}
                                        className={`${classIdx > 0 ? 'print-page-break' : ''} space-y-3`}
                                    >
                                        {/* Class Group Header */}
                                        <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 rounded-xl print:bg-gray-100 print:text-black print:border print:border-gray-300">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-xs font-black bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded print:border print:border-gray-400">
                                                    Kelas {clsName}
                                                </span>
                                                <span className="text-xs text-slate-300 print:text-gray-700 font-semibold">
                                                    ({classPreview.length} siswa)
                                                </span>
                                            </div>
                                            <span className="text-xs text-emerald-400 font-mono font-bold print:text-gray-700">
                                                {parseGradeLevel(clsName) === '9' ? 'Target: Alumni (Lulus)' : `Target: Kelas ${classMapping[clsName] ?? '?'}`}
                                            </span>
                                        </div>

                                        {/* Preview Table per Class */}
                                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                                            <table className="w-full text-sm print-table">
                                                <thead>
                                                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                                                        <th className="text-center p-3 font-semibold w-12">No</th>
                                                        <th className="text-left p-3 font-semibold">Nama Siswa</th>
                                                        <th className="text-left p-3 font-semibold w-32">NIS</th>
                                                        <th className="text-center p-3 font-semibold w-32">Kelas Asal</th>
                                                        <th className="text-center p-3 font-semibold w-36">→ Kelas Baru</th>
                                                        <th className="text-center p-3 font-semibold w-36">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {classPreview.map((s, idx) => (
                                                        <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                            <td className="p-3 text-center text-xs font-mono text-gray-400">{idx + 1}</td>
                                                            <td className="p-3 font-bold text-gray-900">{s.name}</td>
                                                            <td className="p-3 font-mono text-gray-600 text-xs">{s.nis}</td>
                                                            <td className="p-3 text-center">
                                                                <span className="rounded bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-mono font-bold">{s.class}</span>
                                                            </td>
                                                            <td className="p-3 text-center font-mono text-sm font-bold">
                                                                {s.action === 'LULUS' ? (
                                                                    <span className="text-purple-700">ALUMNI</span>
                                                                ) : s.action === 'TIDAK_NAIK' ? (
                                                                    <span className="text-orange-600">{s.class} (ulang)</span>
                                                                ) : s.action === 'KELUAR' ? (
                                                                    <span className="text-red-600">—</span>
                                                                ) : (
                                                                    <span className="text-blue-700">{s.newClass}</span>
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusColor[s.action] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                                    {statusLabel[s.action] ?? s.action}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2 no-print">
                            <button onClick={() => setStep('config')}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Kembali
                            </button>
                            <button
                                onClick={handleExecute}
                                disabled={isPending}
                                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60 flex items-center gap-2 shadow-sm"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Proses Kenaikan Kelas
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
