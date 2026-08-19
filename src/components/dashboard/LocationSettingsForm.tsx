'use client'

import { useFormState } from "react-dom"
import { updateSettings } from "@/actions/settings"
import { Save, MapPin, CheckCircle, RotateCcw, HelpCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface LocationSettingsFormProps {
    settings: Record<string, string>
}

const DEFAULT_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.465492415175!2d111.08868971077755!3d-8.198308782046467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7961bd40e66f8d%3A0xc682da26850c905b!2sMTs%20Negeri%20Pacitan!5e0!3m2!1sen!2sid!4v1705646199464!5m2!1sen!2sid"

export default function LocationSettingsForm({ settings }: LocationSettingsFormProps) {
    // @ts-ignore
    const [state, formAction] = useFormState(updateSettings, null as any)
    const initialMap = settings['map_embed'] || DEFAULT_MAP_URL
    const [mapInput, setMapInput] = useState(initialMap)

    const extractSrcUrl = (text: string): string => {
        if (!text) return ""
        const trimmed = text.trim()
        if (trimmed.includes('<iframe')) {
            const match = trimmed.match(/src=["'](.+?)["']/)
            if (match && match[1]) {
                return match[1]
            }
        }
        return trimmed
    }

    const cleanedMapUrl = extractSrcUrl(mapInput)
    const isNonEmbedUrl = cleanedMapUrl.includes('google.com/maps/place') || cleanedMapUrl.includes('maps.app.goo.gl')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value
        setMapInput(extractSrcUrl(val))
    }

    const resetToDefault = () => {
        setMapInput(DEFAULT_MAP_URL)
    }

    return (
        <form action={formAction} className="space-y-6">
            {state?.success && (
                <div className="rounded-xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Pengaturan peta lokasi berhasil disimpan.</span>
                </div>
            )}
            {state?.error && (
                <div className="rounded-xl bg-rose-50 p-4 text-rose-700 border border-rose-200 font-medium">
                    {state.error}
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 py-4 px-6 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <MapPin className="text-emerald-600" size={20} />
                        <h3 className="font-bold text-slate-800 text-lg">Konfigurasi Peta Lokasi (Google Maps)</h3>
                    </div>
                    <button
                        type="button"
                        onClick={resetToDefault}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset ke Lokasi MTsN 1 Pacitan
                    </button>
                </div>

                <div className="p-6.5 space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            URL / Kode Embed Google Maps <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            name="map_embed"
                            value={mapInput}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Tempelkan URL embed (https://www.google.com/maps/embed?...) atau seluruh kode <iframe> di sini..."
                            className="w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-xs text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        ></textarea>

                        {isNonEmbedUrl && (
                            <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-900">Perhatian: Link Berbagi Biasa Terdeteksi!</p>
                                    <p className="mt-1 leading-relaxed">
                                        URL yang dimasukkan (<code>{cleanedMapUrl.slice(0, 45)}...</code>) adalah link lokasi biasa. Google memblokir link lokasi biasa jika dipasang di dalam frame (Content Blocked). Harap gunakan tombol <strong>"Sematkan Peta (Embed a map)"</strong> dari Google Maps atau klik tombol <strong>"Reset ke Lokasi MTsN 1 Pacitan"</strong> di atas.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-slate-800">
                                <HelpCircle className="w-4 h-4 text-emerald-600" />
                                <span>Cara Mendapatkan Kode Embed Google Maps yang Benar:</span>
                            </div>
                            <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-600 leading-relaxed">
                                <li>Buka <strong>Google Maps</strong> di browser dan cari lokasi sekolah Anda.</li>
                                <li>Klik tombol <strong>Bagikan (Share)</strong> &raquo; pilih tab <strong>Sematkan Peta (Embed a map)</strong>.</li>
                                <li>Klik <strong>Salin HTML (Copy HTML)</strong> lalu tempelkan di atas. Sistem akan otomatis mengekstrak URL embed resmi.</li>
                            </ol>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Pratinjau Peta Lokasi Website
                        </label>
                        <div className="rounded-xl overflow-hidden border border-slate-300 shadow-inner h-[380px] w-full bg-slate-100 relative">
                            {cleanedMapUrl && !isNonEmbedUrl ? (
                                <iframe
                                    src={cleanedMapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50">
                                    <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                                    <p className="font-bold text-slate-800 text-sm">Peta Tidak Dapat Ditampilkan</p>
                                    <p className="text-xs text-slate-500 max-w-md mt-1">
                                        {isNonEmbedUrl
                                            ? "Link yang dimasukkan bukan URL embed valid. Klik tombol 'Reset ke Lokasi MTsN 1 Pacitan' di kanan atas untuk menggunakan peta resmi sekolah."
                                            : "Silakan tempelkan URL Google Maps Embed yang valid di atas."}
                                    </p>
                                    {isNonEmbedUrl && (
                                        <button
                                            type="button"
                                            onClick={resetToDefault}
                                            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition"
                                        >
                                            Gunakan Peta Resmi MTsN 1 Pacitan
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-bold text-white transition-all shadow-md hover:bg-emerald-700 hover:shadow-lg active:scale-98"
                >
                    <Save size={18} />
                    Simpan Pengaturan Peta Lokasi
                </button>
            </div>
        </form>
    )
}
