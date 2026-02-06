
'use client';

import Link from 'next/link';
import { Menu, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import SearchModal from './SearchModal';
import Image from "next/image"

interface NavbarClientProps {
    siteName: string;
    logoUrl: string | null;
}

export default function NavbarClient({ siteName, logoUrl }: NavbarClientProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center space-x-2">
                                {logoUrl && (
                                    <div className="relative w-8 h-8">
                                        <Image src={logoUrl} alt="Logo" fill className="object-contain" />
                                    </div>
                                )}
                                <span className="text-xl font-bold text-emerald-700">{siteName}</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
                            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                                Home
                            </Link>

                            {/* Detail Profil Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2 focus:outline-none">
                                    Profil
                                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                                </button>
                                <div className="absolute left-0 mt-0 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50 transform origin-top-left">
                                    <div className="py-2">
                                        <Link href="/profil/sambutan-kepala" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Sambutan Kepala
                                        </Link>
                                        <Link href="/profil/sejarah" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Sejarah
                                        </Link>
                                        <Link href="/profil/visi-misi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Visi & Misi
                                        </Link>
                                        <Link href="/sarana-prasarana" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Sarana Prasarana
                                        </Link>
                                        <Link href="/profil/guru" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Guru & Staf
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Kesiswaan Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2 focus:outline-none">
                                    Kesiswaan
                                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                                </button>
                                <div className="absolute left-0 mt-0 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50 transform origin-top-left">
                                    <div className="py-2">
                                        <Link href="/prestasi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Prestasi Siswa
                                        </Link>
                                        <Link href="/ekstrakurikuler" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Ekstrakurikuler
                                        </Link>
                                        <Link href="/alumni" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Direktori Alumni
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Public Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2 focus:outline-none">
                                    Informasi
                                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                                </button>
                                <div className="absolute left-0 mt-0 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50 transform origin-top-left">
                                    <div className="py-2">
                                        <Link href="/berita" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Berita
                                        </Link>
                                        <Link href="/agenda" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Agenda
                                        </Link>
                                        <Link href="/pengumuman" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Pengumuman
                                        </Link>
                                        <Link href="/galeri" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Galeri
                                        </Link>
                                        <Link href="/hubungi-kami" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                                            Hubungi Kami
                                        </Link>
                                    </div>
                                </div>
                            </div>


                            <Link href="/download" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                                Download
                            </Link>

                            <Link href="https://pmbm.mtsn1pacitan.sch.id" target="_blank" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                                PMBM
                            </Link>

                            {/* Search & Portal Siswa */}
                            <div className="hidden lg:flex items-center space-x-4 ml-4">
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Cari"
                                >
                                    <Search className="h-5 w-5" />
                                </button>

                                <Link
                                    href="/portal"
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-700 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Portal Siswa
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Menu Button & Search */}
                        <div className="flex items-center space-x-2 lg:hidden">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-gray-600"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                            <button
                                className="p-2 text-gray-600"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="grid gap-4 p-4">
                            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
                                Home
                            </Link>
                            <div className="space-y-1">
                                <div className="px-0 py-2 text-sm font-medium text-gray-900">Profil</div>
                                <div className="pl-4 space-y-2 border-l-2 border-gray-100 ml-1">
                                    <Link href="/profil/sambutan-kepala" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Sambutan Kepala
                                    </Link>
                                    <Link href="/profil/sejarah" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Sejarah
                                    </Link>
                                    <Link href="/profil/visi-misi" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Visi & Misi
                                    </Link>
                                    <Link href="/sarana-prasarana" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Sarana Prasarana
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="px-0 py-2 text-sm font-medium text-gray-900">Kesiswaan</div>
                                <div className="pl-4 space-y-2 border-l-2 border-gray-100 ml-1">
                                    <Link href="/prestasi" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Prestasi Siswa
                                    </Link>
                                    <Link href="/ekstrakurikuler" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Ekstrakurikuler
                                    </Link>
                                    <Link href="/alumni" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Alumni
                                    </Link>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="px-0 py-2 text-sm font-medium text-gray-900">Informasi</div>
                                <div className="pl-4 space-y-2 border-l-2 border-gray-100 ml-1">
                                    <Link href="/berita" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Berita
                                    </Link>
                                    <Link href="/pengumuman" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Pengumuman
                                    </Link>
                                    <Link href="/agenda" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Agenda
                                    </Link>
                                    <Link href="/galeri" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Galeri
                                    </Link>
                                    <Link href="/hubungi-kami" className="block text-sm text-gray-600 hover:text-emerald-600">
                                        Hubungi Kami
                                    </Link>
                                </div>
                            </div>

                            <Link href="/download" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
                                Download
                            </Link>
                            <Link href="https://pmbm.mtsn1pacitan.sch.id" target="_blank" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
                                PMBM
                            </Link>
                            <Link href="/portal" className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700">
                                Portal Siswa
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
