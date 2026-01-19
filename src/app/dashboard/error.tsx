'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 p-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Ada Masalah di Dashboard</h2>
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow border border-red-200">
                <p className="text-sm font-semibold text-gray-500 mb-2">Pesan Error:</p>
                <code className="block bg-red-50 text-red-700 p-3 rounded text-sm break-all font-mono">
                    {error.message || "Unknown error"}
                </code>
                {error.digest && (
                    <p className="text-xs text-gray-400 mt-2">Digest: {error.digest}</p>
                )}
            </div>
            <button
                onClick={() => reset()}
                className="rounded bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                Coba Lagi (Refresh)
            </button>
        </div>
    )
}
