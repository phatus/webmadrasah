'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
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

        // If it's a chunk error caused by dev server restart or updated bundle hashes, reload page once automatically
        if (isChunkError) {
            const reloaded = sessionStorage.getItem('chunk_error_reloaded')
            if (!reloaded) {
                sessionStorage.setItem('chunk_error_reloaded', 'true')
                window.location.reload()
            }
        }
    }, [error, isChunkError])

    const handleRetry = () => {
        if (isChunkError) {
            sessionStorage.removeItem('chunk_error_reloaded')
            window.location.reload()
        } else {
            reset()
        }
    }

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 p-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
                {isChunkError ? 'Versi Kode Diperbarui / Chunk Terputus' : 'Ada Masalah di Dashboard'}
            </h2>
            <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm font-semibold text-slate-500 mb-2">
                    {isChunkError
                        ? 'File komponen web telah diperbarui di server. Silakan refresh halaman untuk memuat versi terbaru.'
                        : 'Pesan Error:'}
                </p>
                <code className="block bg-slate-50 text-slate-700 p-3 rounded-lg text-sm break-all font-mono border border-slate-200">
                    {error.message || 'Unknown error'}
                </code>
                {error.digest && (
                    <p className="text-xs text-slate-400 mt-2">Digest: {error.digest}</p>
                )}
            </div>
            <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
                <RefreshCw className="w-4 h-4" />
                {isChunkError ? 'Muat Ulang Halaman (Reload)' : 'Coba Lagi'}
            </button>
        </div>
    )
}

