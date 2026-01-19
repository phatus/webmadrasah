'use client'

import { useState, useEffect } from "react"
import { Calendar, ArrowLeft, X, ChevronLeft, ChevronRight, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface GalleryViewerProps {
    gallery: {
        id: number
        title: string
        description: string | null
        createdAt: Date
        images: string // JSON string
    }
}

export default function GalleryViewer({ gallery }: GalleryViewerProps) {
    const images = JSON.parse(gallery.images) as string[]
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
        document.body.style.overflow = "hidden" // Prevent scroll
    }

    const closeLightbox = () => {
        setLightboxOpen(false)
        document.body.style.overflow = "auto" // Restore scroll
    }

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return
            if (e.key === "Escape") closeLightbox()
            if (e.key === "ArrowRight") nextImage()
            if (e.key === "ArrowLeft") prevImage()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [lightboxOpen])

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <Link
                    href="/galeri"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Galeri
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="p-8 md:p-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{gallery.title}</h1>
                        <div className="flex items-center text-gray-400 text-sm mb-6">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(gallery.createdAt).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        {gallery.description && (
                            <p className="text-gray-600 leading-relaxed text-lg max-w-3xl border-l-4 border-emerald-500 pl-4 bg-emerald-50/50 py-2 rounded-r">
                                {gallery.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Masonry Layout using CSS Columns */}
                {images.length > 0 ? (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className="break-inside-avoid relative rounded-xl overflow-hidden bg-gray-200 group cursor-zoom-in shadow-sm hover:shadow-lg transition-all border border-gray-100"
                                onClick={() => openLightbox(idx)}
                            >
                                <img
                                    src={img}
                                    alt={`${gallery.title} - ${idx + 1}`}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                        Tidak ada foto dalam album ini.
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 z-60"
                        title="Close (Esc)"
                    >
                        <XCircle size={40} />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full hidden sm:block z-60"
                        title="Previous (Left Arrow)"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full hidden sm:block z-60"
                        title="Next (Right Arrow)"
                    >
                        <ChevronRight size={48} />
                    </button>

                    <div
                        className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[currentImageIndex]}
                            alt={`Fullscreen ${currentImageIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
                        />
                        <div className="absolute -bottom-10 left-0 right-0 text-center text-white/70 text-sm font-medium">
                            Foto {currentImageIndex + 1} dari {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
