import Link from "next/link"
export const dynamic = 'force-dynamic'
import { getGalleries } from "@/actions/academic"
import { Image as ImageIcon } from "lucide-react"

export const metadata = {
    title: 'Galeri Foto - MTsN 1 Pacitan',
    description: 'Dokumentasi kegiatan dan acara di MTsN 1 Pacitan.',
}

export default async function GalleryPage() {
    const galleries = await getGalleries()

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <header className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Galeri Kegiatan</h1>
                    <p className="text-gray-600">Momen-momen berharga warga madrasah.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleries.map((gallery: any) => {
                        const images = JSON.parse(gallery.images) || []

                        return (
                            <Link href={`/galeri/${gallery.id}`} key={gallery.id} className="block group">
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                                    <div className="aspect-video relative bg-gray-200 overflow-hidden">
                                        <img
                                            src={gallery.cover || (images.length > 0 ? images[0] : "https://placehold.co/600x400?text=No+Image")}
                                            alt={gallery.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                        <div className="absolute bottom-3 left-4 text-white text-xs font-medium flex items-center gap-1.5 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full">
                                            <ImageIcon className="w-3 h-3" /> {images.length} Foto
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">{gallery.title}</h3>
                                        <p className="text-gray-500 line-clamp-2 text-sm flex-1">{gallery.description}</p>
                                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                                            <span>Lihat Album</span>
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                {galleries.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        Belum ada album foto yang diupload.
                    </div>
                )}
            </div>
        </div>
    )
}
