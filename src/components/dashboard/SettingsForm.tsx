'use client'

import { useFormState } from "react-dom"
import { updateSettings } from "@/actions/settings"
import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { Upload, Save, Globe, Phone, Share2, User } from "lucide-react"
import Image from "next/image"

interface SettingsFormProps {
    settings: Record<string, string>
}

export default function SettingsForm({ settings }: SettingsFormProps) {
    const [state, formAction] = useFormState(updateSettings, null as any)
    const [logoUrl, setLogoUrl] = useState(settings['site_logo'] || "")

    return (
        <form action={formAction} className="grid grid-cols-1 gap-8">
            {state?.success && (
                <div className="rounded bg-emerald-100 p-4 text-emerald-600 border border-emerald-200">
                    {state.message}
                </div>
            )}
            {state?.error && (
                <div className="rounded bg-red-100 p-4 text-red-600 border border-red-200">
                    {state.error}
                </div>
            )}

            {/* Identitas Website */}
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="border-b border-stroke py-4 px-6.5 flex items-center gap-3">
                    <Globe className="text-emerald-600" />
                    <h3 className="font-medium text-black">Identitas Website</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">Nama Sekolah / Website</label>
                        <input
                            type="text"
                            name="site_name"
                            defaultValue={settings['site_name']}
                            placeholder="MTsN 1 Pacitan"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">Deskripsi Singkat</label>
                        <textarea
                            name="site_description"
                            defaultValue={settings['site_description']}
                            rows={3}
                            placeholder="Deskripsi singkat untuk SEO dan footer..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        ></textarea>
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">Logo Sekolah</label>
                        <input type="hidden" name="site_logo" value={logoUrl} />
                        <div className="flex items-center gap-6">
                            <div className="relative h-20 w-20 rounded bg-gray-100 border border-stroke flex items-center justify-center overflow-hidden">
                                {logoUrl ? (
                                    <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" />
                                ) : (
                                    <span className="text-xs text-gray-500">No Logo</span>
                                )}
                            </div>
                            <CldUploadWidget
                                uploadPreset="webmadrasah_preset"
                                onSuccess={(result: any) => setLogoUrl(result.info.secure_url)}
                                options={{ maxFiles: 1, resourceType: "image" }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="flex items-center justify-center rounded border border-primary bg-primary p-2 px-4 text-white transition hover:bg-opacity-90"
                                    >
                                        <Upload size={16} className="mr-2" />
                                        Upload Logo
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">Nama Kepala Madrasah</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="headmaster_name"
                                defaultValue={settings['headmaster_name']}
                                placeholder="Nama Kepala Madrasah"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-12 pr-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Kontak & Alamat */}
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="border-b border-stroke py-4 px-6.5 flex items-center gap-3">
                    <Phone className="text-blue-600" />
                    <h3 className="font-medium text-black">Kontak & Alamat</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2.5 block text-black">Email</label>
                            <input
                                type="email"
                                name="contact_email"
                                defaultValue={settings['contact_email']}
                                placeholder="email@sekolah.sch.id"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                            />
                        </div>
                        <div>
                            <label className="mb-2.5 block text-black">Telepon</label>
                            <input
                                type="text"
                                name="contact_phone"
                                defaultValue={settings['contact_phone']}
                                placeholder="(0357) ..."
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                            />
                        </div>
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">Alamat Lengkap</label>
                        <textarea
                            name="contact_address"
                            defaultValue={settings['contact_address']}
                            rows={3}
                            placeholder="Jl. ..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Media Sosial */}
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="border-b border-stroke py-4 px-6.5 flex items-center gap-3">
                    <Share2 className="text-purple-600" />
                    <h3 className="font-medium text-black">Media Sosial</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">Facebook URL</label>
                        <input
                            type="text"
                            name="social_facebook"
                            defaultValue={settings['social_facebook']}
                            placeholder="https://facebook.com/..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">Instagram URL</label>
                        <input
                            type="text"
                            name="social_instagram"
                            defaultValue={settings['social_instagram']}
                            placeholder="https://instagram.com/..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black">YouTube URL</label>
                        <input
                            type="text"
                            name="social_youtube"
                            defaultValue={settings['social_youtube']}
                            placeholder="https://youtube.com/..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="flex w-full justify-center rounded bg-emerald-600 p-4 font-medium text-white transition hover:bg-emerald-700 sticky bottom-4 shadow-lg z-10"
            >
                <Save className="mr-2" />
                Simpan Semua Pengaturan
            </button>
        </form>
    )
}
