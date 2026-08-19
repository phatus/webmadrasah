'use client'

import { useFormState } from "react-dom"
import { updateSettings } from "@/actions/settings"
import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { Upload, Save, Globe, Phone, Share2, User, Trash2, RotateCcw, Link as LinkIcon, CheckCircle } from "lucide-react"
import Image from "next/image"

interface SettingsFormProps {
    settings: Record<string, string>
}

export default function SettingsForm({ settings }: SettingsFormProps) {
    // @ts-ignore
    const [state, formAction] = useFormState(updateSettings, null as any)
    const [logoUrl, setLogoUrl] = useState(settings['site_logo'] || "/images/logo.png")
    const [inputLogoUrl, setInputLogoUrl] = useState("")

    return (
        <form action={formAction} className="grid grid-cols-1 gap-8">
            {state?.success && (
                <div className="rounded-xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-medium text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{state.message}</span>
                </div>
            )}
            {state?.error && (
                <div className="rounded-xl bg-rose-50 p-4 text-rose-700 border border-rose-200 font-medium text-sm">
                    {state.error}
                </div>
            )}

            {/* Identitas Website */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 py-4 px-6 flex items-center gap-3 bg-slate-50/50">
                    <Globe className="text-emerald-600" />
                    <h3 className="font-bold text-slate-800 text-lg">Identitas Website</h3>
                </div>
                <div className="p-6.5 space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Sekolah / Website</label>
                        <input
                            type="text"
                            name="site_name"
                            defaultValue={settings['site_name']}
                            placeholder="MTsN 1 Pacitan"
                            className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
                        <textarea
                            name="site_description"
                            defaultValue={settings['site_description']}
                            rows={3}
                            placeholder="Deskripsi singkat untuk SEO dan footer..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        ></textarea>
                    </div>

                    {/* Fitur Logo Sekolah Interaktif */}
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <label className="block text-slate-800 font-bold text-base">Logo Sekolah</label>
                                <p className="text-xs text-slate-500">Logo ini digunakan pada Navbar, Header, dan Footer website.</p>
                            </div>
                            {logoUrl && (
                                <button
                                    type="button"
                                    onClick={() => setLogoUrl('/images/logo.png')}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Reset ke Logo Default
                                </button>
                            )}
                        </div>

                        <input type="hidden" name="site_logo" value={logoUrl} />

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Dual Preview Box (Light & Dark Header simulation) */}
                            <div className="md:col-span-5 flex flex-col gap-2">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pratinjau Tampilan Logo</span>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Light Mode Preview */}
                                    <div className="relative h-28 rounded-xl bg-white border border-slate-300 p-3 flex flex-col items-center justify-center shadow-xs overflow-hidden">
                                        <span className="absolute top-1.5 left-2 text-[10px] font-bold text-slate-400">Header Terang</span>
                                        {logoUrl ? (
                                            <div className="relative w-full h-16 mt-2">
                                                <Image src={logoUrl} alt="Logo Preview Light" fill className="object-contain" />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium">Tanpa Logo</span>
                                        )}
                                    </div>

                                    {/* Dark Mode Preview */}
                                    <div className="relative h-28 rounded-xl bg-slate-900 border border-slate-800 p-3 flex flex-col items-center justify-center shadow-xs overflow-hidden">
                                        <span className="absolute top-1.5 left-2 text-[10px] font-bold text-slate-400">Header Gelap</span>
                                        {logoUrl ? (
                                            <div className="relative w-full h-16 mt-2">
                                                <Image src={logoUrl} alt="Logo Preview Dark" fill className="object-contain" />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-500 font-medium">Tanpa Logo</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action & Upload Options */}
                            <div className="md:col-span-7 flex flex-col gap-4">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Opsi Pengubahan Logo</span>

                                <div className="flex flex-wrap gap-3">
                                    <CldUploadWidget
                                        uploadPreset="webmadrasah_preset"
                                        onSuccess={(result: any) => {
                                            if (result?.info?.secure_url) {
                                                setLogoUrl(result.info.secure_url)
                                            }
                                        }}
                                        options={{ maxFiles: 1, resourceType: "image" }}
                                    >
                                        {({ open }) => (
                                            <button
                                                type="button"
                                                onClick={() => open()}
                                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-xs"
                                            >
                                                <Upload size={15} />
                                                Unggah dari Komputer / Cloud
                                            </button>
                                        )}
                                    </CldUploadWidget>

                                    {logoUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setLogoUrl('')}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Hapus Logo
                                        </button>
                                    )}
                                </div>

                                {/* Direct URL Option */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Atau Tempel Link / URL Logo</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                value={inputLogoUrl}
                                                onChange={(e) => setInputLogoUrl(e.target.value)}
                                                placeholder="https://... atau /images/logo.png"
                                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-emerald-600 font-medium"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (inputLogoUrl.trim()) {
                                                    setLogoUrl(inputLogoUrl.trim())
                                                    setInputLogoUrl('')
                                                }
                                            }}
                                            className="rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-900 transition shrink-0"
                                        >
                                            Gunakan URL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Kepala Madrasah</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="headmaster_name"
                                defaultValue={settings['headmaster_name']}
                                placeholder="Nama Kepala Madrasah"
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Kontak & Alamat */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 py-4 px-6 flex items-center gap-3 bg-slate-50/50">
                    <Phone className="text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-lg">Kontak & Alamat</h3>
                </div>
                <div className="p-6.5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                            <input
                                type="email"
                                name="contact_email"
                                defaultValue={settings['contact_email']}
                                placeholder="email@sekolah.sch.id"
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Telepon</label>
                            <input
                                type="text"
                                name="contact_phone"
                                defaultValue={settings['contact_phone']}
                                placeholder="(0357) ..."
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Alamat Lengkap</label>
                        <textarea
                            name="contact_address"
                            defaultValue={settings['contact_address']}
                            rows={3}
                            placeholder="Jl. ..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Media Sosial */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 py-4 px-6 flex items-center gap-3 bg-slate-50/50">
                    <Share2 className="text-purple-600" />
                    <h3 className="font-bold text-slate-800 text-lg">Media Sosial</h3>
                </div>
                <div className="p-6.5 space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Facebook URL</label>
                        <input
                            type="text"
                            name="social_facebook"
                            defaultValue={settings['social_facebook']}
                            placeholder="https://facebook.com/..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Instagram URL</label>
                        <input
                            type="text"
                            name="social_instagram"
                            defaultValue={settings['social_instagram']}
                            placeholder="https://instagram.com/..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">YouTube URL</label>
                        <input
                            type="text"
                            name="social_youtube"
                            defaultValue={settings['social_youtube']}
                            placeholder="https://youtube.com/..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-4 px-6 font-bold text-white transition hover:bg-emerald-700 sticky bottom-4 shadow-xl z-10"
            >
                <Save size={18} />
                Simpan Semua Pengaturan
            </button>
        </form>
    )
}
