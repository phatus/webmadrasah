
import Link from "next/link"
import Image from "next/image"
import { Users, Calendar, MapPin, ArrowRight } from "lucide-react"
import { getExtracurriculars } from "@/actions/extracurricular"

export const metadata = {
    title: 'Ekstrakurikuler - MTsN 1 Pacitan',
    description: 'Wadah pengembangan bakat dan minat siswa MTsN 1 Pacitan melalui berbagai kegiatan ekstrakurikuler.',
}

export default async function EkstrakurikulerPage() {
    const { extracurriculars } = await getExtracurriculars()
    // @ts-ignore
    const ekstraList = extracurriculars || []

    return (
        <main className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-emerald-600 pt-32 pb-12 sm:pt-40 sm:pb-16 lg:pt-48 lg:pb-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4 sm:text-5xl lg:text-6xl">
                        Ekstrakurikuler
                    </h1>
                    <p className="mt-4 text-xl text-emerald-100 max-w-2xl mx-auto">
                        Mengembangkan potensi, bakat, dan karakter siswa melalui beragam kegiatan positif di luar jam pelajaran.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    {ekstraList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ekstraList.map((item: any) => (
                                <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                <Users size={48} className="opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                            <div className="p-6 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users size={16} />
                                                    <span className="text-sm font-medium">{item.pembina ? `Pembina: ${item.pembina}` : 'Tim Pembina'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                            {item.name}
                                        </h3>

                                        <div className="space-y-3 mb-6 flex-1">
                                            {item.description && (
                                                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="pt-4 space-y-2 border-t border-gray-100">
                                                {item.schedule && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                                        <span>{item.schedule}</span>
                                                    </div>
                                                )}
                                                {item.location && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                                        <span>{item.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button className="w-full mt-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 group-hover:shadow-md">
                                            Lihat Kegiatan
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4">
                                <Users className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Belum ada data ekstrakurikuler</h3>
                            <p className="mt-1 text-gray-500">Segera daftarkan diri anda di sekretariat.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
