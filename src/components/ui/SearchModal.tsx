
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, File, Users, Trophy, Building2, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Static Data for Navigation Search
const SEARCH_ITEMS = [
    // Pages
    { title: "Beranda", url: "/", type: "Halaman", icon: Building2 },
    { title: "Visi & Misi", url: "/profil/visi-misi", type: "Halaman", icon: File },
    { title: "Sejarah Madrasah", url: "/profil/sejarah", type: "Halaman", icon: File },
    { title: "Sambutan Kepala Madrasah", url: "/profil/sambutan-kepala", type: "Halaman", icon: File },
    { title: "Guru & Staf", url: "/profil/guru", type: "Halaman", icon: Users },
    { title: "Prestasi Siswa", url: "/prestasi", type: "Halaman", icon: Trophy },
    { title: "Ekstrakurikuler", url: "/ekstrakurikuler", type: "Halaman", icon: Trophy },
    { title: "Berita & Artikel", url: "/berita", type: "Halaman", icon: BookOpen },
    { title: "Agenda Kegiatan", url: "/agenda", type: "Halaman", icon: Calendar },
    { title: "Download Dokumen", url: "/download", type: "Halaman", icon: File },
    { title: "Galeri Foto", url: "/galeri", type: "Halaman", icon: File },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }

        // Lock body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredItems = SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-screen items-start justify-center p-4 sm:p-6 md:p-20">
                <div className="relative w-full max-w-2xl transform rounded-xl bg-white shadow-2xl transition-all">

                    {/* Search Input */}
                    <div className="relative border-b border-gray-100 px-4 py-4 sm:px-6">
                        <div className="pointer-events-none absolute inset-y-0 left-6 flex items-center">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full border-0 bg-transparent py-4 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-lg"
                            placeholder="Cari halaman, berita, atau informasi..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') onClose();
                            }}
                        />
                        <button
                            onClick={onClose}
                            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto px-2 py-4 sm:px-4">
                        {query === '' ? (
                            <div className="text-center py-12">
                                <p className="text-sm text-gray-500">Ketik kata kunci untuk mulai mencari.</p>
                            </div>
                        ) : filteredItems.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.url}
                                            onClick={onClose}
                                            className="group flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 group-hover:text-emerald-700">{item.title}</h4>
                                                    <span className="text-xs text-gray-500">{item.type}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-900 font-medium">Tidak ada hasil ditemukan</p>
                                <p className="text-sm text-gray-500 mt-1">Kami tidak dapat menemukan apa yang Anda cari.</p>
                            </div>
                        )}

                        {/* Quick Links Footer (Optional) */}
                        {query === '' && (
                            <div className="mt-8">
                                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Tautan Populer</h5>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/profil/guru" onClick={onClose} className="text-sm text-gray-600 hover:text-emerald-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                                        Guru & Staf
                                    </Link>
                                    <Link href="/prestasi" onClick={onClose} className="text-sm text-gray-600 hover:text-emerald-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                                        Prestasi Siswa
                                    </Link>
                                    <Link href="/download" onClick={onClose} className="text-sm text-gray-600 hover:text-emerald-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                                        Download Dokumen
                                    </Link>
                                    <Link href="/berita" onClick={onClose} className="text-sm text-gray-600 hover:text-emerald-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                                        Berita Terbaru
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
