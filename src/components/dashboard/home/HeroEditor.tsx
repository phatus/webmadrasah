'use client'

import { updateHero } from "@/actions/home-editor"
import { useActionState } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { CldUploadWidget } from 'next-cloudinary'
import { X, Plus, Image as ImageIcon, ArrowLeft, ArrowRight, Link as LinkIcon, CheckCircle } from 'lucide-react'

type HeroData = {
    title: string;
    content: string;
    meta?: string | null;
}

export default function HeroEditor({ initialData }: { initialData: HeroData | null }) {
    // @ts-ignore
    const [state, formAction] = useActionState(updateHero, null)

    // Parse meta
    let meta: any = {}
    try {
        if (initialData?.meta) {
            meta = JSON.parse(initialData.meta)
        }
    } catch (e) {
        console.error("Error parsing hero meta:", e)
    }

    const initialImages = Array.isArray(meta.images) ? meta.images : (meta.image ? [meta.image] : [])
    const [images, setImages] = useState<string[]>(initialImages)
    const [inputUrl, setInputUrl] = useState('')

    useEffect(() => {
        if (initialData?.meta) {
            try {
                const parsed = JSON.parse(initialData.meta)
                if (Array.isArray(parsed.images)) {
                    setImages(parsed.images)
                } else if (parsed.image) {
                    setImages([parsed.image])
                }
            } catch (e) {}
        }
    }, [initialData])

    const addImageByUrl = () => {
        if (!inputUrl.trim()) return
        setImages((prev) => [...prev, inputUrl.trim()])
        setInputUrl('')
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const moveImage = (index: number, direction: 'left' | 'right') => {
        const targetIndex = direction === 'left' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= images.length) return
        setImages((prev) => {
            const next = [...prev]
            const temp = next[index]
            next[index] = next[targetIndex]
            next[targetIndex] = temp
            return next
        })
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 py-4 px-6 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">
                    Edit Hero Section (Slider Gambar Homepage)
                </h3>
            </div>
            
            <form action={formAction}>
                <div className="p-6.5 space-y-6">
                    {/* Hero Images Section */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-slate-800 font-semibold text-sm">
                                Gambar Hero Slider ({images.length} Gambar)
                            </label>
                            <span className="text-xs text-slate-500 font-medium">
                                Tambahkan beberapa foto untuk slider otomatis
                            </span>
                        </div>

                        {/* Grid of uploaded images */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {images.map((url, index) => (
                                <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                                    <Image
                                        src={url}
                                        alt={`Slide ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => moveImage(index, 'left')}
                                                className="p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow transition-transform hover:scale-110"
                                                title="Geser Kiri"
                                            >
                                                <ArrowLeft size={14} />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow transition-transform hover:scale-110"
                                            title="Hapus Slide"
                                        >
                                            <X size={14} />
                                        </button>
                                        {index < images.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => moveImage(index, 'right')}
                                                className="p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow transition-transform hover:scale-110"
                                                title="Geser Kanan"
                                            >
                                                <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                                        Slide {index + 1}
                                    </div>
                                </div>
                            ))}

                            {/* Cloudinary Upload Button */}
                            <CldUploadWidget
                                uploadPreset="webmadrasah_preset"
                                onSuccess={(result: any) => {
                                    if (result?.info?.secure_url) {
                                        setImages((prev) => [...prev, result.info.secure_url]);
                                    }
                                }}
                            >
                                {({ open }) => {
                                    return (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="flex aspect-video flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-500/50 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50 transition-all cursor-pointer"
                                        >
                                            <Plus className="mb-1 text-emerald-600" size={24} />
                                            <span className="text-xs font-bold">Unggah Gambar (Cloud)</span>
                                        </button>
                                    );
                                }}
                            </CldUploadWidget>
                        </div>

                        {/* Input URL Manual Option */}
                        <div className="flex gap-2 items-center mt-3">
                            <div className="relative flex-1">
                                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="url"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="Atau tempel URL gambar (https://...)"
                                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-emerald-600"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addImageByUrl}
                                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-all shrink-0"
                            >
                                + Tambah URL
                            </button>
                        </div>

                        {images.length === 0 && (
                            <div className="py-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 mt-4">
                                <ImageIcon size={36} className="mx-auto text-slate-400 mb-2" />
                                <p className="text-sm font-medium text-slate-600">Belum ada slide gambar yang ditambahkan.</p>
                                <p className="text-xs text-slate-400 mt-1">Klik tombol "Unggah Gambar" atau isi URL gambar untuk menambah slide hero.</p>
                            </div>
                        )}

                        <input type="hidden" name="images" value={JSON.stringify(images)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Judul Utama (Headline)
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={initialData?.title || ""}
                                placeholder="Contoh: Selamat Datang di MTsN 1 Pacitan"
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Deskripsi (Slogan)
                            </label>
                            <textarea
                                name="content"
                                rows={2}
                                defaultValue={initialData?.content || ""}
                                placeholder="Contoh: Madrasah Hebat Bermartabat..."
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            ></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Tombol Utama (Teks)
                            </label>
                            <input
                                type="text"
                                name="primaryButtonText"
                                defaultValue={meta.primaryButtonText || "Profil Madrasah"}
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Tombol Utama (Link Tujuan)
                            </label>
                            <input
                                type="text"
                                name="primaryButtonLink"
                                defaultValue={meta.primaryButtonLink || "/profil"}
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                            {state.error}
                        </div>
                    )}

                    {state?.success && (
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span>{state.success}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-lg bg-emerald-600 py-3.5 px-6 font-bold text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                    >
                        Simpan Perubahan Hero Slider
                    </button>
                </div>
            </form>
        </div>
    )
}
