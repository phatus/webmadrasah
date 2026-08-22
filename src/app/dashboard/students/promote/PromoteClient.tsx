'use client'

import { useState, useTransition, useMemo } from "react"
import { promoteStudents } from "@/actions/academic-year"
import Link from "next/link"
import {
    ArrowLeft, TrendingUp, GraduationCap, AlertTriangle,
    CheckCircle2, ArrowRight, Users, BookOpen, Settings2, RotateCcw
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

const CLASS_LEVELS = ['7', '8', '9']

function getClassLevel(cls: string): string {
    return cls.charAt(0)
}

function getDefaultMapping(classes: string[]): Record<string, string> {
    const mapping: Record<string, string> = {}
    classes.forEach(cls => {
        const level = getClassLevel(cls)
        const rombel = cls.substring(1)
        if (level === '7') mapping[cls] = `8${rombel}`
        else if (level === '8') mapping[cls] = `9${rombel}`
        // kelas 9 → LULUS (no mapping needed)
    })
    return mapping
}

const statusColor: Record<string, string> = {
    'NAIK': 'bg-blue-50 text-blue-700',
    'LULUS': 'bg-purple-50 text-purple-700',
    'TIDAK_NAIK': 'bg-orange-50 text-orange-700',
    'KELUAR': 'bg-red-50 text-red-700',
    'PERLU_KONFIGURASI': 'bg-yellow-50 text-yellow-700',
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

    // Derive unique class names from active students
    const uniqueClasses = useMemo(() => {
        const set = new Set(students.map(s => s.class))
        return Array.from(set).sort((a, b) => {
            const lvA = parseInt(a), lvB = parseInt(b)
            if (lvA !== lvB) return lvA - lvB
            return a.localeCompare(b)
        })
    }, [students])

    const [classMapping, setClassMapping] = useState<Record<string, string>>(() => getDefaultMapping(uniqueClasses))

    // Compute preview data
    const previewData = useMemo(() => {
        return students.map(s => {
            const exc = exceptions[s.id]
            const isGraduating = getClassLevel(s.class) === '9'
            let action: string
            let newClass: string

            if (exc) {
                action = exc
                newClass = exc === 'TIDAK_NAIK' ? s.class : '-'
            } else if (isGraduating) {
                action = 'LULUS'
                newClass = 'ALUMNI'
            } else {
                const mapped = classMapping[s.class]
                action = mapped ? 'NAIK' : 'PERLU_KONFIGURASI'
                newClass = mapped ?? '?'
            }

            return { ...s, action, newClass }
        })
    }, [students, classMapping, exceptions])

    const stats = useMemo(() => ({
        naik: previewData.filter(s => s.action === 'NAIK').length,
        lulus: previewData.filter(s => s.action === 'LULUS').length,
        tidakNaik: previewData.filter(s => s.action === 'TIDAK_NAIK').length,
        keluar: previewData.filter(s => s.action === 'KELUAR').length,
        perluKonfig: previewData.filter(s => s.action === 'PERLU_KONFIGURASI').length,
    }), [previewData])

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

    const selectedYear = years.find(y => y.id === selectedYearId)

    if (step === 'result') {
        return (
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default sm:px-7.5">
                <div className="flex items-center gap-3 mb-8">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${result?.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {result?.success ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <AlertTriangle className="h-6 w-6 text-red-600" />}
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-black">{result?.success ? 'Kenaikan Kelas Selesai!' : 'Proses Gagal'}</h4>
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
                            <div key={item.label} className={`rounded-lg border p-4 text-center bg-${item.color}-50 border-${item.color}-100`}>
                                <div className={`text-3xl font-bold text-${item.color}-700`}>{item.value}</div>
                                <div className={`text-sm text-${item.color}-600 mt-1`}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3">
                    <Link href="/dashboard/students"
                        className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition">
                        Lihat Data Siswa
                    </Link>
                    <Link href="/dashboard/alumni"
                        className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                        Lihat Data Alumni
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default sm:px-7.5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/students" className="text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-black">Proses Kenaikan Kelas</h4>
                        <p className="text-sm text-gray-500">MTs — Kelas 7→8, 8→9, 9→Alumni</p>
                    </div>
                </div>
                {/* Step Indicator */}
                <div className="hidden sm:flex items-center gap-2 text-sm">
                    <button onClick={() => setStep('config')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${step === 'config' ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-gray-500 hover:text-gray-800'}`}>
                        <Settings2 className="h-4 w-4" /> 1. Konfigurasi
                    </button>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                    <button onClick={() => stats.perluKonfig === 0 && setStep('preview')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition ${step === 'preview' ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'text-gray-400'} ${stats.perluKonfig === 0 ? 'hover:text-gray-800 cursor-pointer' : 'cursor-not-allowed'}`}>
                        <Users className="h-4 w-4" /> 2. Preview
                    </button>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                    <span className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400">
                        <CheckCircle2 className="h-4 w-4" /> 3. Selesai
                    </span>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                    { label: 'Naik Kelas', value: stats.naik, icon: TrendingUp, color: 'blue' },
                    { label: 'Lulus → Alumni', value: stats.lulus, icon: GraduationCap, color: 'purple' },
                    { label: 'Tidak Naik', value: stats.tidakNaik, icon: RotateCcw, color: 'orange' },
                    { label: 'Keluar', value: stats.keluar, icon: AlertTriangle, color: 'red' },
                    { label: 'Perlu Konfigurasi', value: stats.perluKonfig, icon: Settings2, color: stats.perluKonfig > 0 ? 'yellow' : 'gray' },
                ].map(item => (
                    <div key={item.label} className={`rounded-lg border p-3 text-center ${item.color === 'blue' ? 'bg-blue-50 border-blue-100' : item.color === 'purple' ? 'bg-purple-50 border-purple-100' : item.color === 'orange' ? 'bg-orange-50 border-orange-100' : item.color === 'red' ? 'bg-red-50 border-red-100' : item.color === 'yellow' ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'}`}>
                        <div className={`text-2xl font-bold ${item.color === 'blue' ? 'text-blue-700' : item.color === 'purple' ? 'text-purple-700' : item.color === 'orange' ? 'text-orange-700' : item.color === 'red' ? 'text-red-700' : item.color === 'yellow' ? 'text-yellow-700' : 'text-gray-500'}`}>{item.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                    </div>
                ))}
            </div>

            {step === 'config' && (
                <div className="space-y-6">
                    {/* Step 1: Select Academic Year */}
                    <div className="rounded-lg border border-gray-200 p-5">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                            Pilih Tahun Pelajaran Tujuan
                        </h5>
                        {years.length === 0 ? (
                            <div className="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                                Belum ada tahun pelajaran.{' '}
                                <Link href="/dashboard/students/academic-years" className="font-semibold underline">Buat dulu di sini →</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {years.map(year => (
                                    <button
                                        key={year.id}
                                        type="button"
                                        onClick={() => setSelectedYearId(year.id)}
                                        className={`rounded-lg border-2 p-3 text-left transition ${selectedYearId === year.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="font-semibold text-sm">{year.name}</div>
                                        {year.isActive && <div className="text-xs text-emerald-600 mt-0.5">★ Tahun Aktif</div>}
                                        <div className="text-xs text-gray-500 mt-0.5">{year._count.classHistory} riwayat tersimpan</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Step 2: Class Mapping Config */}
                    <div className="rounded-lg border border-gray-200 p-5">
                        <h5 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-indigo-500" />
                            Konfigurasi Pemetaan Kelas
                        </h5>
                        <p className="text-xs text-gray-500 mb-4">
                            Kelas 9 otomatis → Alumni. Atur kelas tujuan untuk kelas 7 dan 8.
                        </p>

                        {['7', '8'].map(level => {
                            const levelClasses = uniqueClasses.filter(c => getClassLevel(c) === level)
                            if (levelClasses.length === 0) return null
                            return (
                                <div key={level} className="mb-5">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Kelas {level}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {levelClasses.map(cls => (
                                            <div key={cls} className="flex items-center gap-2">
                                                <span className="rounded-md bg-blue-100 text-blue-800 px-2.5 py-1 text-sm font-mono font-bold w-14 text-center">{cls}</span>
                                                <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                <input
                                                    type="text"
                                                    value={classMapping[cls] ?? ''}
                                                    onChange={e => setClassMapping(prev => ({ ...prev, [cls]: e.target.value }))}
                                                    placeholder={`Kelas tujuan...`}
                                                    className={`flex-1 rounded-md border px-2.5 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!classMapping[cls] ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Kelas 9 info */}
                        {uniqueClasses.filter(c => getClassLevel(c) === '9').length > 0 && (
                            <div className="rounded-lg bg-purple-50 border border-purple-100 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-2 flex items-center gap-1">
                                    <GraduationCap className="h-4 w-4" /> Kelas 9 → Lulus → Alumni (Otomatis)
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {uniqueClasses.filter(c => getClassLevel(c) === '9').map(cls => (
                                        <span key={cls} className="rounded-md bg-purple-100 text-purple-800 px-2.5 py-1 text-sm font-mono font-bold">{cls}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 3: Per-student exceptions */}
                    <div className="rounded-lg border border-gray-200 p-5">
                        <h5 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Pengecualian Per Siswa
                        </h5>
                        <p className="text-xs text-gray-500 mb-4">Tandai siswa yang tidak naik kelas atau keluar (opsional).</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                                        <th className="text-left p-2.5 font-medium">Nama</th>
                                        <th className="text-left p-2.5 font-medium">NIS</th>
                                        <th className="text-center p-2.5 font-medium">Kelas</th>
                                        <th className="text-center p-2.5 font-medium">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students
                                        .filter(s => getClassLevel(s.class) !== '9') // Kelas 9 sudah otomatis lulus
                                        .map((s, idx) => (
                                            <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                <td className="p-2.5 font-medium text-gray-900">{s.name}</td>
                                                <td className="p-2.5 font-mono text-gray-500 text-xs">{s.nis}</td>
                                                <td className="p-2.5 text-center">
                                                    <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-mono">{s.class}</span>
                                                </td>
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
                                                        className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

                    {/* Next button */}
                    <div className="flex justify-end gap-3">
                        <Link href="/dashboard/students"
                            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                            Batal
                        </Link>
                        <button
                            onClick={() => setStep('preview')}
                            disabled={!canProceed}
                            className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Lihat Preview <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                    {!canProceed && stats.perluKonfig > 0 && (
                        <p className="text-right text-xs text-yellow-600 mt-1">⚠ Ada {stats.perluKonfig} kelas yang belum dikonfigurasi mapping-nya.</p>
                    )}
                    {!canProceed && !selectedYearId && (
                        <p className="text-right text-xs text-red-600 mt-1">Pilih tahun pelajaran tujuan terlebih dahulu.</p>
                    )}
                </div>
            )}

            {step === 'preview' && (
                <div className="space-y-4">
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <strong>Tinjau sebelum melanjutkan.</strong> Proses ini akan mengubah kelas {stats.naik + stats.lulus} siswa, membuat {stats.lulus} entri alumni baru, dan menghapus semua riwayat pelanggaran siswa yang naik/lulus. Tahun pelajaran: <strong>{selectedYear?.name}</strong>.
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <th className="text-left p-3 font-medium">Nama</th>
                                    <th className="text-left p-3 font-medium">NIS</th>
                                    <th className="text-center p-3 font-medium">Kelas Sekarang</th>
                                    <th className="text-center p-3 font-medium">→ Kelas Baru</th>
                                    <th className="text-center p-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((s, idx) => (
                                    <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                        <td className="p-3 font-medium text-gray-900">{s.name}</td>
                                        <td className="p-3 font-mono text-gray-500 text-xs">{s.nis}</td>
                                        <td className="p-3 text-center">
                                            <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-mono">{s.class}</span>
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
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[s.action] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {statusLabel[s.action] ?? s.action}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <button onClick={() => setStep('config')}
                            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </button>
                        <button
                            onClick={handleExecute}
                            disabled={isPending}
                            className="rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60 flex items-center gap-2"
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
    )
}
