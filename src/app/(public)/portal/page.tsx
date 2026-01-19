
import Link from 'next/link'
import { Construction, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Portal Siswa - Segera Hadir | MTsN 1 Pacitan',
    description: 'Layanan Portal Siswa MTsN 1 Pacitan sedang dalam tahap pengembangan.',
}

export default function PortalComingSoonPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-lg mx-auto">
                <div className="mb-8 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
                        <Construction className="h-12 w-12 text-emerald-600" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Segera Hadir
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Fitur <span className="font-semibold text-emerald-700">Portal Siswa</span> saat ini sedang dalam tahap pengembangan untuk memberikan pelayanan akademik terbaik bagi Anda.
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm text-left">
                        <h3 className="font-semibold text-gray-900 mb-2">Fitur yang akan datang:</h3>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Cek Nilai & Rapor Digital</li>
                            <li>Jadwal Pelajaran & Kalender Akademik</li>
                            <li>Informasi Absensi Kehadiran</li>
                            <li>Materi Belajar & Tugas</li>
                        </ul>
                    </div>

                    <div className="pt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
