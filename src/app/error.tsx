'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const isChunkError =
        error?.name === 'ChunkLoadError' ||
        (error?.message &&
            (error.message.includes('Loading chunk') ||
                error.message.includes('Failed to load chunk')))

    useEffect(() => {
        console.error(error)

        if (isChunkError) {
            const reloaded = sessionStorage.getItem('root_chunk_error_reloaded')
            if (!reloaded) {
                sessionStorage.setItem('root_chunk_error_reloaded', 'true')
                window.location.reload()
            }
        }
    }, [error, isChunkError])

    const handleRetry = () => {
        if (isChunkError) {
            sessionStorage.removeItem('root_chunk_error_reloaded')
            window.location.reload()
        } else {
            reset()
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
                <AlertTriangle size={32} />
            </div>
            <h1 className="text-xl font-bold mb-2">
                {isChunkError ? 'Halaman Perlu Dimuat Ulang' : 'Terjadi Kesalahan Aplikasi'}
            </h1>
            <p className="text-sm text-slate-600 max-w-md text-center mb-6">
                {isChunkError
                    ? 'Server telah memperbarui beberapa file komponen web. Silakan lakukan muat ulang halaman.'
                    : error.message || 'Terjadi kesalahan sistem yang tidak terduga.'}
            </p>
            <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
                <RefreshCw className="w-4 h-4" />
                {isChunkError ? 'Muat Ulang Halaman' : 'Coba Lagi'}
            </button>
        </div>
    )
}
