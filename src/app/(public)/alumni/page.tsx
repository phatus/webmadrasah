
import { getAlumni } from "@/actions/alumni"
import { Search, MapPin, Briefcase, GraduationCap, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
    title: "Direktori Alumni | MTsN 1 Pacitan",
    description: "Data alumni MTsN 1 Pacitan yang telah sukses berkarya di berbagai bidang.",
}

export default async function AlumniPublicPage() {
    // Only fetch verified alumni
    const alumniList = await getAlumni({ verifiedOnly: true })

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-emerald-800 to-teal-900 py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Direktori Alumni</h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg mb-8">
                        Menjalin silaturahmi dan jejak karir keluarga besar MTsN 1 Pacitan.
                    </p>
                    <Link
                        href="/alumni/register"
                        className="inline-flex items-center gap-2 bg-white text-emerald-800 px-6 py-3 rounded-full font-bold hover:bg-emerald-50 transition shadow-lg"
                    >
                        <GraduationCap size={20} />
                        Daftar Sebagai Alumni
                    </Link>
                </div>
            </section>

            {/* List */}
            <section className="py-12 px-4">
                <div className="container mx-auto max-w-6xl">

                    {/* Search Placeholder (Client Logic would be better here for real search, but static list for now) */}
                    {/* <div className="mb-8 relative max-w-md mx-auto">
                        <input type="text" placeholder="Cari alumni berdasarkan nama..." className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alumniList.map((alumni: any) => (
                            <div key={alumni.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition flex flex-col items-center text-center">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 mb-4 bg-gray-100 flex items-center justify-center">
                                    {alumni.image ? (
                                        <Image src={alumni.image} alt={alumni.name} fill className="object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-400" />
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1">{alumni.name}</h3>
                                <div className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">
                                    Angkatan {alumni.graduationYear}
                                </div>

                                <div className="w-full space-y-3">
                                    <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                                        <Briefcase size={16} className="text-gray-400" />
                                        <span>{alumni.currentStatus}</span>
                                    </div>
                                    {alumni.institution && (
                                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="font-medium">{alumni.institution}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {alumniList.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-gray-500 text-lg">Belum ada data alumni yang ditampilkan.</h3>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
