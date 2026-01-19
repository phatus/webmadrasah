
import Image from "next/image"
import { getFacilities } from "@/actions/facility"
import { MapPin } from "lucide-react"

export const metadata = {
    title: "Sarana & Prasarana | MTsN 1 Pacitan",
    description: "Fasilitas dan sarana prasarana penunjang kegiatan belajar mengajar di MTsN 1 Pacitan.",
}

export default async function SaranaPrasaranaPage() {
    const facilities = await getFacilities()

    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10"></div>

                {/* Background Image Suggestion: School Panorama */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2938&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale mix-blend-multiply"></div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-4 backdrop-blur-sm">
                        Fasilitas Madrasah
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        Sarana & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Prasarana</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Menunjang kenyamanan dan kualitas pembelajaran dengan infrastruktur yang memadai dan lingkungan yang kondusif.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 px-4 md:px-8">
                <div className="container mx-auto">

                    {facilities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {facilities.map((item: any, index: number) => (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <MapPin className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white drop-shadow-md">{item.name}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                            {item.description || "Fasilitas penunjang kegiatan siswa."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Data Fasilitas</h3>
                            <p className="text-gray-500 max-w-md">
                                Data sarana dan prasarana madrasah belum ditambahkan. Silakan cek kembali nanti.
                            </p>
                        </div>
                    )}

                </div>
            </section>
        </main>
    )
}
