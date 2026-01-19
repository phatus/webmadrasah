'use client'

import { BookOpen, Laptop, Languages, Trophy, Sparkles, Monitor, Globe, FileText } from "lucide-react"

const defaultPrograms = [
    {
        title: "Program Tahfidz & Tadarus",
        description: "Membentuk generasi Qur'ani melalui pembiasaan tadarus pagi setiap hari dan program hafalan Al-Qur'an (Tahfidz) yang terstruktur dan terbimbing.",
        icon: "BookOpen",
        color: "bg-emerald-100 text-emerald-600",
        borderColor: "border-emerald-200"
    },
    {
        title: "Kelas Digital & Riset",
        description: "Pembelajaran modern berbasis teknologi dengan e-learning, serta pengembangan literasi digital dan riset sains (Myres) bagi siswa berbakat.",
        icon: "Laptop",
        color: "bg-blue-100 text-blue-600",
        borderColor: "border-blue-200"
    },
    {
        title: "Pengembangan Bahasa",
        description: "Program intensif Bahasa Arab dan Inggris (Bilingual) untuk meningkatkan kemampuan komunikasi siswa dalam menghadapi tantangan global.",
        icon: "Languages",
        color: "bg-orange-100 text-orange-600",
        borderColor: "border-orange-200"
    },
    {
        title: "Bina Prestasi Ekstrakurikuler",
        description: "Pembinaan intensif bakat dan minat (Drumband, Olahraga, Seni, Pramuka) yang telah melahirkan banyak juara tingkat kabupaten hingga provinsi.",
        icon: "Trophy",
        color: "bg-purple-100 text-purple-600",
        borderColor: "border-purple-200"
    }
]

// Icon mapping
const iconMap: any = { BookOpen, Laptop, Languages, Trophy, Sparkles, Monitor, Globe, FileText }

interface Program {
    id?: number
    title: string
    description: string
    icon: string
    color: string
}

export default function FeaturedPrograms({ programs }: { programs?: Program[] }) {
    const displayPrograms = programs && programs.length > 0 ? programs : defaultPrograms

    return (
        <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Keunggulan Madrasah</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Program Unggulan <span className="text-emerald-600">MTsN 1 Pacitan</span>
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Kami berkomitmen memberikan pendidikan terbaik melalui berbagai program unggulan yang dirancang untuk mengembangkan potensi akademik, spiritual, dan karakter siswa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayPrograms.map((program, index) => {
                        const Icon = iconMap[program.icon] || BookOpen
                        // Handle color class format if coming from DB vs default
                        const colorClass = program.color

                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2`}
                            >
                                <div className={`w-16 h-16 rounded-2xl ${colorClass.split(' ').slice(0, 2).join(' ')} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {program.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {program.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
