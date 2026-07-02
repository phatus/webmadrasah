import Link from "next/link"
import { Plus, Pencil, ShieldAlert, Upload } from "lucide-react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getStudents } from "@/actions/student"
import DeleteStudentButton from "./DeleteStudentButton"

export const metadata = {
    title: "Data Siswa | Dashboard",
}

export default async function StudentsPage() {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const students = await getStudents()

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
                <div className="flex gap-3">
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

            <div className="flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-4 rounded-sm bg-gray-100 p-2.5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase text-gray-600">NIS</h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase text-gray-600">Nama Siswa</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase text-gray-600">Kelas</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase text-gray-600">Aksi</h5>
                    </div>
                </div>

                {students.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <ShieldAlert className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                        <p>Belum ada data siswa.</p>
                        <p className="text-sm mt-1">Tambahkan siswa menggunakan tombol di atas.</p>
                    </div>
                ) : (
                    students.map((student, key) => (
                        <div
                            key={student.id}
                            className={`grid grid-cols-4 ${key === students.length - 1 ? "" : "border-b border-gray-100"}`}
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-sm font-mono text-gray-600">{student.nis}</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="font-medium text-black">{student.name}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <span className="bg-blue-50 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {student.class}
                                </span>
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
                Total: <span className="font-medium text-black">{students.length}</span> siswa terdaftar
            </div>
        </div>
    )
}
