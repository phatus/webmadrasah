'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { ImagePlus, Trash, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface ImageUploadProps {
    value: string
    onChange: (value: string) => void
    onRemove: (value: string) => void
    maxSizeInMB?: number // default 5MB
    allowedFormats?: string[] // default ['jpg', 'jpeg', 'png', 'webp']
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    maxSizeInMB = 5,
    allowedFormats = ['jpg', 'jpeg', 'png', 'webp']
}: ImageUploadProps) {
    const [error, setError] = useState<string | null>(null)

    const validateFile = (file: File): boolean => {
        setError(null)

        // Check file size
        const maxSize = maxSizeInMB * 1024 * 1024
        if (file.size > maxSize) {
            setError(`File terlalu besar. Maksimal ${maxSizeInMB}MB`)
            return false
        }

        // Check file type
        const fileExt = file.name.split('.').pop()?.toLowerCase()
        const mimeType = file.type

        const allowedExtensions = allowedFormats
        const allowedMimeTypes = allowedFormats.map(ext => {
            switch(ext) {
                case 'jpg': case 'jpeg': return 'image/jpeg'
                case 'png': return 'image/png'
                case 'webp': return 'image/webp'
                case 'gif': return 'image/gif'
                default: return `image/${ext}`
            }
        })

        if (!allowedExtensions.includes(fileExt || '') && !allowedMimeTypes.includes(mimeType)) {
            setError(`Format file tidak didukung. Gunakan: ${allowedFormats.join(', ')}`)
            return false
        }

        return true
    }

    const onUpload = (result: any) => {
        if (result.event !== 'success') {
            setError('Upload gagal. Silakan coba lagi.')
            return
        }
        setError(null)
        onChange(result.info.secure_url)
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value && (
                    <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => onRemove(value)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={value}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}
            </div>
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <CldUploadWidget
                uploadPreset="webmadrasah_preset"
                onSuccess={onUpload}
                options={{
                    maxFiles: 1,
                    sources: ['local', 'url', 'camera'],
                    multiple: false,
                    cropping: true,
                    croppingAspectRatio: 1, // Force square crop for teachers/profiles
                    showSkipCropButton: false,
                    croppingShowDimensions: true,
                    croppingValidateDimensions: true,
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        setError(null)
                        open()
                    }

                    return (
                        <button
                            type="button"
                            disabled={!!value}
                            onClick={onClick}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md flex items-center gap-2 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ImagePlus className="w-4 h-4" />
                            {value ? 'Ganti Gambar' : 'Upload Image'}
                        </button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}
