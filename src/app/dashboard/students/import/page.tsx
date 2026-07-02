import StudentImportForm from "@/components/dashboard/StudentImportForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChevronLeft, Users } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Impor Data Siswa | Dashboard",
}

export default async function StudentImportPage() {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Impor Data Siswa</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            Import data siswa secara massal menggunakan file CSV atau salin langsung dari Excel / Google Sheets.
                        </p>
                    </div>
                </div>
                <Link
                    href="/dashboard/students"
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm shrink-0"
                >
                    <ChevronLeft size={18} />
                    KEMBALI
                </Link>
            </div>

            {/* Info Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-stroke p-5 flex items-start gap-4 shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-black text-sm">Unduh Template</h4>
                        <p className="text-xs text-gray-500 mt-1">Unduh template CSV sebagai panduan kolom yang benar.</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-stroke p-5 flex items-start gap-4 shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-black text-sm">Isi & Unggah Data</h4>
                        <p className="text-xs text-gray-500 mt-1">Isi data di spreadsheet lalu upload file CSV atau copy-paste.</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-stroke p-5 flex items-start gap-4 shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-black text-sm">Review & Simpan</h4>
                        <p className="text-xs text-gray-500 mt-1">Cek pratinjau data, lalu klik Mulai Impor untuk menyimpan.</p>
                    </div>
                </div>
            </div>

            <StudentImportForm />
        </div>
    )
}
