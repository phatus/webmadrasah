'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { triggerElearningSync } from '@/actions/elearning-sync'

export default function SyncElearningButton() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleSync = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await triggerElearningSync()
      if (res.success) {
        setStatus({ success: true, message: res.message })
      } else {
        setStatus({ success: false, error: res.error })
      }
    } catch (err: any) {
      setStatus({ success: false, error: err.message || "Gagal menghubungi server." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
        title="Sinkronkan data Siswa, Guru, dan Tahun Ajaran ke E-Learning"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Menyinkronkan...' : 'Sinkronkan ke E-Learning'}
      </button>

      {status && (
        <div
          className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
            status.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          {status.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          )}
          <span>{status.success ? status.message : status.error}</span>
        </div>
      )}
    </div>
  )
}
