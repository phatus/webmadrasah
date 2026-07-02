'use client'

import { useFormState } from "react-dom"
import { updateSettings } from "@/actions/settings"
import { useState } from "react"
import { Save, Key, Eye, EyeOff, Lock, AlertCircle } from "lucide-react"

interface TeacherAccessFormProps {
    settings: Record<string, string>
}

export default function TeacherAccessForm({ settings }: TeacherAccessFormProps) {
    const [state, formAction] = useFormState(updateSettings, null as any)
    const [showKey, setShowKey] = useState(false)
    const currentKey = settings['teacher_access_key'] || ""

    return (
        <form action={formAction} className="space-y-6">
            {state?.success && (
                <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700 border border-emerald-100 font-medium animate-in fade-in slide-in-from-top-4">
                    {state.message || "Pengaturan berhasil disimpan"}
                </div>
            )}
            {state?.error && (
                <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-100 font-medium animate-in shake">
                    {state.error}
                </div>
            )}

            <div className="rounded-2xl border border-stroke bg-white shadow-default overflow-hidden">
                <div className="border-b border-stroke py-4 px-6.5 bg-gray-50 flex items-center gap-3">
                    <Key className="text-blue-600" size={20} />
                    <h3 className="font-bold text-black uppercase tracking-tight">Kredensial Akses Guru</h3>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-bold text-black uppercase tracking-wider">
                            Kode Akses Mode Guru (Password)
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type={showKey ? "text" : "password"}
                                name="teacher_access_key"
                                defaultValue={currentKey}
                                placeholder="Masukkan kode akses baru (contoh: gurumadrasah123)"
                                className="w-full rounded-xl border-2 border-stroke bg-transparent py-3 pl-12 pr-12 font-medium outline-none transition focus:border-blue-600 active:border-blue-600 placeholder:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800 text-sm">
                            <AlertCircle className="mt-0.5 text-amber-600 shrink-0" size={20} />
                            <div>
                                <p className="font-bold">Penting:</p>
                                <p className="mt-1">
                                    Kode akses ini digunakan oleh guru untuk membuka form pencatatan pelanggaran siswa pada halaman publik.
                                    Pastikan untuk memberitahukan kode akses baru ini kepada para guru setelah Anda mengubahnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 font-black text-white transition-all shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl active:scale-95"
                >
                    <Save size={20} />
                    SIMPAN KODE AKSES
                </button>
            </div>
        </form>
    )
}
