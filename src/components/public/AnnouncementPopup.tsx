'use client'

import { useState, useEffect } from "react"
import { X, Bell } from "lucide-react"
import { usePathname } from "next/navigation"

interface AnnouncementPopupProps {
    announcements: {
        id: number
        title: string
        content: string | null
    }[]
}

export default function AnnouncementPopup({ announcements }: AnnouncementPopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const pathname = usePathname()

    useEffect(() => {
        // Only show on homepage
        if (pathname !== '/') return

        // Show popup if there are announcements and not dismissed in this session
        if (announcements.length > 0) {
            const hasSeen = sessionStorage.getItem(`seen_announcement_${announcements[0].id}`)
            if (!hasSeen) {
                // Small delay for better effect
                const timer = setTimeout(() => setIsOpen(true), 1500)
                return () => clearTimeout(timer)
            }
        }
    }, [announcements, pathname])

    const handleClose = () => {
        setIsOpen(false)
        // Mark as seen
        if (announcements[currentIndex]) {
            sessionStorage.setItem(`seen_announcement_${announcements[currentIndex].id}`, 'true')
        }
    }

    if (!isOpen || announcements.length === 0 || pathname !== '/') return null

    const currentItem = announcements[currentIndex]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between bg-emerald-600 px-6 py-4 text-white">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <Bell className="h-5 w-5 animate-bounce" />
                        Pengumuman Penting
                    </h3>
                    <button onClick={handleClose} className="rounded-full p-1 hover:bg-white/20 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8">
                    <h4 className="mb-3 text-xl font-bold text-gray-900">{currentItem.title}</h4>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                        {currentItem.content}
                    </p>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                        Saya Mengerti
                    </button>
                </div>
            </div>
        </div>
    )
}
