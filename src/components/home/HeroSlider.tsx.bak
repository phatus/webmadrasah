'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSliderProps {
    images: string[]
    title: string
    content: string
    primaryButtonText?: string
    primaryButtonLink?: string
}

export default function HeroSlider({
    images,
    title,
    content,
    primaryButtonText,
    primaryButtonLink
}: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (images.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 6000)

        return () => clearInterval(interval)
    }, [images.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    // Split title for highlighting "MTsN 1 Pacitan"
    const highlightedTitle = title.includes("MTsN 1 Pacitan") ? (
        <>
            {title.split("MTsN 1 Pacitan")[0]}
            <span className="text-green-400">MTsN 1 Pacitan</span>
            {title.split("MTsN 1 Pacitan")[1]}
        </>
    ) : title

    return (
        <div className="relative w-full h-full group">
            {/* Background Images */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={img}
                        alt={`Hero Slide ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="max-w-3xl space-y-8 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Website Resmi Madrasah
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                        {highlightedTitle}
                    </h1>

                    <p className="text-xl text-gray-200 leading-relaxed max-w-2xl drop-shadow-md">
                        {content}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                            href={primaryButtonLink || "/profil"}
                            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:-translate-y-1 block"
                        >
                            {primaryButtonText || "Profil Madrasah"}
                        </Link>
                        <Link
                            href="/berita"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:-translate-y-1"
                        >
                            Baca Berita <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 transition-all duration-300 rounded-full ${index === currentIndex ? "w-8 bg-green-500" : "w-2 bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
