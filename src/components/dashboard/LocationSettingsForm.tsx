'use client'

import { useFormState } from "react-dom"
import { updateSettings } from "@/actions/settings"
import { Save, MapPin, Info } from "lucide-react"

interface LocationSettingsFormProps {
    settings: Record<string, string>
}

export default function LocationSettingsForm({ settings }: LocationSettingsFormProps) {
    const [state, formAction] = useFormState(updateSettings, null as any)
    const currentMap = settings['map_embed'] || ""

    // Simple helper to extract src from iframe if user pastes the whole thing
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pasteData = e.clipboardData.getData('text')
        if (pasteData.includes('<iframe')) {
            const srcMatch = pasteData.match(/src=["'](.+?)["']/)
            if (srcMatch && srcMatch[1]) {
                // We'll let the user see what they pasted or we can auto-transform
                // For now, let's just let them paste and we'll handle it or they can manually fix
            }
        }
    }

    return (
        <form action={formAction} className="space-y-6">
            {state?.success && (
                <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700 border border-emerald-100 font-medium animate-in fade-in slide-in-from-top-4">
                    {state.message}
                </div>
            )}
            {state?.error && (
                <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-100 font-medium animate-in shake">
                    {state.error}
                </div>
            )}

            <div className="rounded-2xl border border-stroke bg-white shadow-default overflow-hidden">
                <div className="border-b border-stroke py-4 px-6.5 bg-gray-50 flex items-center gap-3">
                    <MapPin className="text-emerald-600" size={20} />
                    <h3 className="font-bold text-black uppercase tracking-tight">Konfigurasi Peta Lokasi</h3>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-bold text-black uppercase tracking-wider">
                            URL Embed Google Maps
                        </label>
                        <textarea
                            name="map_embed"
                            defaultValue={currentMap}
                            rows={4}
                            onPaste={handlePaste}
                            placeholder="Tempel URL atau kode iframe Google Maps di sini..."
                            className="w-full rounded-xl border-2 border-stroke bg-transparent py-4 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 placeholder:text-gray-400"
                        ></textarea>

                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 text-blue-800 text-sm italic">
                            <div className="mt-0.5">💡</div>
                            <p>
                                <strong>Tips:</strong> Buka Google Maps, cari lokasi sekolah, klik <strong>Bagikan</strong> &raquo; <strong>Sematkan Peta</strong>, lalu salin URL yang ada di dalam atribut <code>src="..."</code> atau tempel seluruh kode iframe ke sini.
                            </p>
                        </div>
                    </div>

                    {currentMap && (
                        <div>
                            <label className="mb-3 block text-sm font-bold text-black uppercase tracking-wider">
                                Preview Peta
                            </label>
                            <div className="rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-inner h-[400px] w-full bg-gray-100 flex items-center justify-center">
                                <iframe
                                    src={currentMap.includes('<iframe') ? (currentMap.match(/src=["'](.+?)["']/)?.[1] || "") : currentMap}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-10 py-4 font-black text-white transition-all shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl active:scale-95"
                >
                    <Save size={20} />
                    SIMPAN LOKASI
                </button>
            </div>
        </form>
    )
}
