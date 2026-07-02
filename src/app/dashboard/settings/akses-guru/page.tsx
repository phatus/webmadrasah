import TeacherAccessForm from "@/components/dashboard/TeacherAccessForm"
import { getSettings } from "@/actions/settings"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Pengaturan Akses Guru | Web Madrasah",
}

export default async function TeacherAccessPage() {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const settings = await getSettings()

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tight">Akses Mode Guru</h1>
                    <p className="text-sm font-medium text-gray-500 mt-2">
                        Kelola kode akses (password) yang digunakan oleh guru untuk melakukan pencatatan pelanggaran siswa.
                    </p>
                </div>
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
                >
                    <ChevronLeft size={18} />
                    KEMBALI KE PENGATURAN
                </Link>
            </div>

            <TeacherAccessForm settings={settings} />
        </div>
    )
}
