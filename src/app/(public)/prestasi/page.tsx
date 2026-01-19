
import Link from "next/link"
import Image from "next/image"
import { Trophy, Medal, Star } from "lucide-react"
import { getAchievements } from "@/actions/achievement"

export const metadata = {
    title: 'Prestasi Siswa | MTsN 1 Pacitan',
    description: 'Daftar prestasi membanggakan siswa-siswi MTsN 1 Pacitan',
};

export default async function PrestasiPage() {
    const { achievements } = await getAchievements()
    // @ts-ignore
    const prestasiList = achievements || []

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Hall of Fame</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Catatan tinta emas prestasi siswa-siswi MTsN 1 Pacitan di berbagai bidang.
                    </p>
                </div>

                {/* Stats Section - Keep as static design elements or calculate basic counts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-1">{prestasiList.length}+</div>
                        <div className="text-sm text-gray-500">Total Prestasi</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 text-center">
                        <div className="text-3xl font-bold text-amber-500 mb-1">10+</div>
                        <div className="text-sm text-gray-500">Tingkat Nasional</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">25+</div>
                        <div className="text-sm text-gray-500">Tingkat Provinsi</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 text-center">
                        <div className="text-3xl font-bold text-indigo-600 mb-1">100%</div>
                        <div className="text-sm text-gray-500">Kebanggaan</div>
                    </div>
                </div>

                {/* Prestasi Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {prestasiList.length > 0 ? (
                        prestasiList.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                                            <Trophy className="w-16 h-16 opacity-40 mb-2" />
                                            <span className="text-xs font-medium opacity-60">Dokumentasi</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                                        {new Date(item.date).getFullYear()}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-emerald-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Medal className="w-5 h-5 text-amber-500" />
                                        <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">{item.level}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 md:h-14">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-emerald-400" />
                                        {item.rank || "Juara"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4">
                                <Trophy className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Belum ada data prestasi</h3>
                            <p className="mt-1 text-gray-500">Silahkan tambahkan data melalui dashboard.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
