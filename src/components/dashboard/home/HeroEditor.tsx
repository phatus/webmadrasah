'use client'

import { updateHero } from "@/actions/home-editor"
import { useActionState } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { CldUploadWidget } from 'next-cloudinary'
import { X, Plus, Image as ImageIcon } from 'lucide-react'

// Define the type properly
type HeroData = {
    title: string;
    content: string;
    meta?: string | null;
}

export default function HeroEditor({ initialData }: { initialData: HeroData | null }) {
    // @ts-ignore
    const [state, formAction] = useActionState(updateHero, null)

    // Parse meta if it exists
    let meta: any = {}
    try {
        if (initialData?.meta) {
            meta = JSON.parse(initialData.meta)
        }
    } catch (e) {
        console.error("Error parsing hero meta:", e)
    }

    // Handle legacy single image or new images array
    const initialImages = Array.isArray(meta.images) ? meta.images : (meta.image ? [meta.image] : [])
    const [images, setImages] = useState<string[]>(initialImages)

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Edit Hero Section
                </h3>
            </div>
            <form action={formAction}>
                <div className="p-6.5">
                    {/* Hero Images Section */}
                    <div className="mb-6">
                        <label className="mb-2.5 block text-black dark:text-white font-medium">
                            Hero Images (Slider)
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                            {images.map((url, index) => (
                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-stroke dark:border-strokedark">
                                    <Image
                                        src={url}
                                        alt={`Hero ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                                        Slide {index + 1}
                                    </div>
                                </div>
                            ))}

                            <CldUploadWidget
                                uploadPreset="webmadrasah_preset"
                                onSuccess={(result: any) => {
                                    setImages([...images, result.info.secure_url]);
                                }}
                            >
                                {({ open }) => {
                                    return (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-gray dark:bg-meta-4 hover:bg-opacity-10 transition-colors"
                                        >
                                            <Plus className="text-primary mb-1" size={24} />
                                            <span className="text-xs text-primary font-medium">Add Photo</span>
                                        </button>
                                    );
                                }}
                            </CldUploadWidget>
                        </div>

                        {images.length === 0 && (
                            <div className="py-10 text-center border-2 border-dashed border-stroke rounded-lg">
                                <ImageIcon size={40} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">No images uploaded yet. Add at least one image for the hero slider.</p>
                            </div>
                        )}

                        <input type="hidden" name="images" value={JSON.stringify(images)} />
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Judul Utama (Headline)
                        </label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={initialData?.title || ""}
                            placeholder="Contoh: Selamat Datang di MTsN 1..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Deskripsi (Slogan)
                        </label>
                        <textarea
                            name="content"
                            rows={3}
                            defaultValue={initialData?.content || ""}
                            placeholder="Contoh: Madrasah Hebat Bermartabat..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        ></textarea>
                    </div>

                    <div className="mb-4.5 flex gap-4">
                        <div className="w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Tombol Utama (Text)
                            </label>
                            <input
                                type="text"
                                name="primaryButtonText"
                                // @ts-ignore
                                defaultValue={meta.primaryButtonText || "Profil Madrasah"}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Tombol Utama (Link)
                            </label>
                            <input
                                type="text"
                                name="primaryButtonLink"
                                // @ts-ignore
                                defaultValue={meta.primaryButtonLink || "/profil"}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="mb-4 rounded bg-red-50 py-2 px-4 text-sm text-red-600">
                            {state.error}
                        </div>
                    )}

                    {state?.success && (
                        <div className="mb-4 rounded bg-green-50 py-2 px-4 text-sm text-green-600">
                            {state.success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 transition-all"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    )
}
