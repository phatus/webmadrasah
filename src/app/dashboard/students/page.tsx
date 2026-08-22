import Link from "next/link"
import { Plus, Pencil, ShieldAlert, Upload, TrendingUp, CalendarDays } from "lucide-react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getStudents } from "@/actions/student"
import DeleteStudentButton from "./DeleteStudentButton"

export const metadata = {
    title: "Data Siswa | Dashboard",
}

const STATUS_COLORS: Record<string, string> = {
    AKTIF: 'bg-emerald-50 text-emerald-700',
    LULUS: 'bg-purple-50 text-purple-700',
    KELUAR: 'bg-red-50 text-red-700',
}

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>
}) {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { status = 'AKTIF' } = await searchParams
    const students = await getStudents(undefined, status)

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-black">Data Siswa</h4>
                        <p className="text-sm text-gray-500">Kelola data master siswa untuk pencatatan pelanggaran</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    <Link
                        href="/dashboard/students/academic-years"
                        className="inline-flex items-center gap-2 rounded border border-stroke bg-white py-2.5 px-4 text-sm font-bold text-gray-600 hover:text-black hover:border-gray-400 transition shadow-sm"
                    >
                        <CalendarDays className="h-4 w-4" />
                        Tahun Pelajaran
                    </Link>
                    <Link
                        href="/dashboard/students/promote"
                        className="inline-flex items-center gap-2 rounded border border-emerald-300 bg-emerald-50 py-2.5 px-4 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-sm"
                    >
                        <TrendingUp className="h-4 w-4" />
                        Kenaikan Kelas
                    </Link>
                    <Link
                        href="/dashboard/students/import"
                        className="inline-flex items-center gap-2 rounded border border-stroke bg-white py-2.5 px-4 text-sm font-bold text-gray-600 hover:text-black hover:border-gray-400 transition shadow-sm"
                    >
                        <Upload className="h-4 w-4" />
                        Impor Siswa
                    </Link>
                    <Link
                        href="/dashboard/students/create"
                        className="inline-flex items-center gap-2 rounded bg-emerald-600 py-2.5 px-4 text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Siswa
                    </Link>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1 mb-4 border-b border-gray-200">
                {[
                    { label: 'Aktif', value: 'AKTIF' },
                    { label: 'Lulus', value: 'LULUS' },
                    { label: 'Keluar', value: 'KELUAR' },
                    { label: 'Semua', value: 'SEMUA' },
                ].map(tab => (
                    <Link
                        key={tab.value}
                        href={`/dashboard/students?status=${tab.value}`}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-px ${
                            status === tab.value
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            <div className="flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-5 rounded-sm bg-gray-100 p-2.5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase text-gray-600">NIS</h5>
                    </div>
                    <div className="p-2.5 xl:p-5 col-span-2">
                        <h5 className="text-sm font-medium uppercase text-gray-600">Nama Siswa</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase text-gray-600">Kelas / Status</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase text-gray-600">Aksi</h5>
                    </div>
                </div>

                {students.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <ShieldAlert className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <p>Tidak ada siswa dengan status <strong>{status.toLowerCase()}</strong>.</p>
                        <p className="text-sm mt-1">Gunakan filter di atas untuk melihat siswa lainnya.</p>
                    </div>
                ) : (
                    students.map((student: { id: number; nis: string; name: string; class: string; status: string }, key: number) => (
                        <div
                            key={student.id}
                            className={`grid grid-cols-5 ${key === students.length - 1 ? "" : "border-b border-gray-100"}`}
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-sm font-mono text-gray-600">{student.nis}</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5 col-span-2">
                                <p className="font-medium text-black">{student.name}</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                                <span className="bg-blue-50 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded font-mono">
                                    {student.class}
                                </span>
                                {student.status !== 'AKTIF' && (
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[student.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {student.status}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-center gap-3 p-2.5 xl:p-5">
                                <Link
                                    href={`/dashboard/students/${student.id}/edit`}
                                    className="text-gray-500 hover:text-emerald-600 transition-colors"
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                <DeleteStudentButton studentId={student.id} studentName={student.name} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pb-4 text-sm text-gray-500">
                Total: <span className="font-medium text-black">{students.length}</span> siswa{status !== 'SEMUA' ? ` (${status.toLowerCase()})` : ''}
            </div>
        </div>
    )
}
