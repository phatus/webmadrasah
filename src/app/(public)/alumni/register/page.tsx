
import AlumniForm from "@/components/dashboard/AlumniForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Registrasi Alumni | MTsN 1 Pacitan",
    description: "Formulir pendaftaran data alumni MTsN 1 Pacitan.",
}

export default function AlumniRegisterPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <Link href="/alumni" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition">
                    <ArrowLeft size={18} className="mr-2" /> Kembali ke Direktori
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrasi Alumni</h1>
                    <p className="text-gray-600">
                        Isi formulir di bawah ini untuk bergabung dengan database alumni. Data Anda akan diverifikasi oleh admin sebelum ditampilkan.
                    </p>
                </div>

                {/* Reuse the dashboard form component but with isAdmin=false */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <AlumniForm isAdmin={false} />
                </div>
            </div>
        </main>
    )
}
