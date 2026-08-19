'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { ImagePlus, Trash, AlertCircle, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

interface ImageUploadProps {
    value: string
    onChange: (value: string) => void
    onRemove: (value: string) => void
    maxSizeInMB?: number
    allowedFormats?: string[]
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    maxSizeInMB = 5,
    allowedFormats = ['jpg', 'jpeg', 'png', 'webp']
}: ImageUploadProps) {
    const [error, setError] = useState<string | null>(null)
    const [urlInput, setUrlInput] = useState('')

    const onUpload = (result: any) => {
        if (result.event !== 'success') {
            setError('Upload gagal. Silakan coba lagi.')
            return
        }
        setError(null)
        if (result.info?.secure_url) {
            onChange(result.info.secure_url)
        }
    }

    const handleApplyUrl = () => {
        if (!urlInput.trim()) return
        setError(null)
        onChange(urlInput.trim())
        setUrlInput('')
    }

    return (
        <div className="space-y-3">
            {/* Image Preview Box */}
            {value && (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 group">
                    <Image
                        fill
                        className="object-cover"
                        alt="Preview"
                        src={value}
                        sizes="160px"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => onRemove(value)}
                            className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                            title="Hapus Foto"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Action Buttons & Manual URL */}
            <div className="flex flex-col sm:flex-row gap-2">
                <CldUploadWidget
                    uploadPreset="webmadrasah_preset"
                    onSuccess={onUpload}
                    options={{
                        maxFiles: 1,
                        sources: ['local', 'url', 'camera'],
                        multiple: false,
                    }}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => {
                                setError(null)
                                open()
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-xs cursor-pointer shrink-0"
                        >
                            <ImagePlus className="w-4 h-4" />
                            {value ? 'Ganti Foto' : 'Unggah Foto (Cloud)'}
                        </button>
                    )}
                </CldUploadWidget>

                <div className="flex flex-1 gap-2">
                    <div className="relative flex-1">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="Atau tempelkan link / URL foto (https://...)"
                            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white outline-none focus:border-emerald-600 font-medium"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleApplyUrl}
                        className="px-3.5 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition shrink-0"
                    >
                        Pakai URL
                    </button>
                </div>
            </div>
        </div>
    )
}
