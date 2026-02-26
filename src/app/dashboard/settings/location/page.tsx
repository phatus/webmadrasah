import LocationSettingsForm from "@/components/dashboard/LocationSettingsForm"
import { getSettings } from "@/actions/settings"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Pengaturan Lokasi | Web Madrasah",
}

export default async function LocationPage() {
    const settings = await getSettings()

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tight">Peta Lokasi Sekolah</h1>
                    <p className="text-sm font-medium text-gray-500 mt-2">
                        Kelola data lokasi sekolah yang akan ditampilkan di halaman kontak dan profil.
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

            <LocationSettingsForm settings={settings} />
        </div>
    )
}
