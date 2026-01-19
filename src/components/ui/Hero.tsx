import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-white">
            <div className="mx-auto max-w-7xl">
                <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
                    <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Selamat Datang di</span>{' '}
                                <span className="block text-emerald-600 xl:inline">MTsN 1 Pacitan</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                                Madrasah Hebat Bermartabat. Membentuk generasi islami, cerdas, dan berakhlaqul karimah.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link
                                        href="#"
                                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-3 text-base font-medium text-white hover:bg-emerald-700 md:py-4 md:px-10 md:text-lg"
                                    >
                                        Profil Madrasah
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link
                                        href="/berita"
                                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-100 px-8 py-3 text-base font-medium text-emerald-700 hover:bg-emerald-200 md:py-4 md:px-10 md:text-lg"
                                    >
                                        Baca Berita <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50">
                <div className="flex h-full items-center justify-center p-8">
                    {/* Placeholder for Hero Image - In real app, use next/image */}
                    <div className="h-64 w-full rounded-lg bg-emerald-900/10 flex items-center justify-center">
                        <span className="text-emerald-700 font-medium">Hero Image Area</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
