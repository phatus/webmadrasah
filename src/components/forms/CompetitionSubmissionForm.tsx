'use client'

import { useState } from 'react'
import { submitWork } from '@/actions/submission'
import { CheckCircle2, AlertCircle, Send } from 'lucide-react'

interface CompetitionSubmissionFormProps {
    competitionId: number
    competitionTitle: string
}

export default function CompetitionSubmissionForm({ competitionId, competitionTitle }: CompetitionSubmissionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await submitWork(competitionId, formData)

        setIsSubmitting(false)
        if (result.success) {
            setIsSuccess(true)
        } else if (result.error) {
            setError(result.error)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">Pendaftaran Berhasil!</h3>
                <p className="text-emerald-700 font-medium">
                    Terima kasih telah berpartisipasi dalam <strong>{competitionTitle}</strong>. Karya Anda sedang dalam proses verifikasi oleh panitia.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-emerald-600 font-bold hover:underline"
                >
                    Kirim pendaftaran lain?
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden ring-1 ring-black/5">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-white text-center">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Formulir Pendaftaran</h3>
                <p className="text-emerald-50 text-sm font-medium opacity-90 mt-1">Lengkapi data Anda untuk bergabung.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-4 animate-shake">
                        <AlertCircle className="h-6 w-6 shrink-0 text-red-500" />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                            <input
                                name="fullName"
                                type="text"
                                required
                                placeholder="Ahmad Fauzi"
                                className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm font-medium outline-none transition-all placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-[6px] focus:ring-emerald-50/50"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Sekolah / Instansi</label>
                            <input
                                name="school"
                                type="text"
                                placeholder="MTsN 1 Pacitan"
                                className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm font-medium outline-none transition-all placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-[6px] focus:ring-emerald-50/50"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="ahmad@email.com"
                                className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm font-medium outline-none transition-all placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-[6px] focus:ring-emerald-50/50"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="081234567xxx"
                                className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm font-medium outline-none transition-all placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-[6px] focus:ring-emerald-50/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-tight block">
                            Link Karya (YouTube/Drive/Lainnya)
                        </label>
                        <input
                            name="workUrl"
                            type="url"
                            required
                            placeholder="https://..."
                            className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 text-sm font-medium outline-none transition-all placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-[6px] focus:ring-emerald-50/50"
                        />
                        <p className="text-[10px] text-slate-400 mt-2 px-1 italic">
                            * Pastikan pengaturan akses link ke <strong>Public</strong> agar juri bisa melihat karya Anda.
                        </p>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-emerald-600 px-8 py-5 text-base font-black text-white shadow-[0_10px_30px_rgba(5,150,105,0.3)] transition-all hover:bg-emerald-700 hover:shadow-[0_15px_40px_rgba(5,150,105,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                <span>Mengirim...</span>
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                <span>KIRIM SEKARANG</span>
                            </>
                        )}
                    </button>
                    
                    <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">
                        Pendaftaran ini bersifat final. Pastikan semua data sudah benar sebelum mengirim.
                    </p>
                </div>
            </form>
        </div>
    )
}
