'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { ImagePlus, Trash } from 'lucide-react'

interface ImageUploadProps {
    value: string
    onChange: (value: string) => void
    onRemove: (value: string) => void
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
}: ImageUploadProps) {
    const onUpload = (result: any) => {
        if (result.event !== 'success') return
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
                        open()
                    }

                    return (
                        <button
                            type="button"
                            disabled={!!value}
                            onClick={onClick}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md flex items-center gap-2 border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ImagePlus className="w-4 h-4" />
                            Upload Image
                        </button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}
