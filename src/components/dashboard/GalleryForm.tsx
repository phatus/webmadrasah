'use client'

import { useState } from "react"
import { createGallery, updateGallery } from "@/actions/academic"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import Link from "next/link"
import { Upload, X, ImageIcon, Trash2 } from "lucide-react"

interface GalleryFormProps {
    data?: {
        id: number
        title: string
        description: string | null
        cover: string | null
        images: string // JSON string
    }
}

export default function GalleryForm({ data }: GalleryFormProps) {
    const isEdit = !!data
    const [coverUrl, setCoverUrl] = useState(data?.cover || "")
    const [images, setImages] = useState<string[]>(
        data?.images ? JSON.parse(data.images) : []
    )
    const [loading, setLoading] = useState(false)

    // Handle form submission manually to properly manage JSON state
    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        // Append dynamic values
        formData.set("cover", coverUrl)
        formData.set("images", JSON.stringify(images))

        if (isEdit) {
            await updateGallery(data.id, formData)
        } else {
            await createGallery(formData)
        }
        setLoading(false)
    }

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove))
    }

    return (
        <form action={handleSubmit} className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
                <h3 className="font-medium text-black">
                    {isEdit ? "Edit Album Foto" : "Buat Album Baru"}
                </h3>
            </div>

            <div className="p-6.5">
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Judul Album <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={data?.title}
                        placeholder="Contoh: Kegiatan Matsama 2024"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                        required
                    />
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Deskripsi
                    </label>
                    <textarea
                        rows={3}
                        name="description"
                        defaultValue={data?.description || ""}
                        placeholder="Deskripsi singkat kegiatan..."
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                    ></textarea>
                </div>

                {/* Cover Image Section */}
                <div className="mb-6 border-b border-stroke pb-6">
                    <label className="mb-2.5 block text-black font-semibold">
                        Sampul Album
                    </label>
                    <CldUploadWidget
                        uploadPreset="webmadrasah_preset"
                        onSuccess={(result: any) => {
                            setCoverUrl(result.info.secure_url)
                        }}
                        options={{
                            maxFiles: 1,
                            resourceType: "image",
                            clientAllowedFormats: ["image"],
                        }}
                    >
                        {({ open }) => (
                            <div
                                onClick={() => open()}
                                className="relative flex min-h-[160px] w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-primary bg-gray-50 hover:bg-gray-100 transition"
                            >
                                {coverUrl ? (
                                    <div className="relative h-full w-full min-h-[160px]">
                                        <Image
                                            src={coverUrl}
                                            alt="Cover Image"
                                            fill
                                            className="object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setCoverUrl("")
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Cover</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <ImageIcon className="mb-2 h-8 w-8 text-primary" />
                                        <span className="text-sm font-medium text-black">
                                            Upload Cover
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </CldUploadWidget>
                </div>

                {/* Gallery Images Section */}
                <div className="mb-4.5">
                    <div className="flex items-center justify-between mb-2.5">
                        <label className="block text-black font-semibold">
                            Foto-foto Kegiatan ({images.length})
                        </label>
                        <CldUploadWidget
                            uploadPreset="webmadrasah_preset"
                            onSuccess={(result: any) => {
                                // Append new image to list
                                setImages((prev: string[]) => [...prev, result.info.secure_url])
                            }}
                            options={{
                                multiple: true,
                                maxFiles: 10,
                                resourceType: "image",
                                clientAllowedFormats: ["image"],
                            }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="flex items-center gap-2 rounded bg-emerald-600 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-700"
                                >
                                    <Upload size={16} />
                                    Tambah Foto
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>

                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <Image
                                        src={img}
                                        alt={`Gallery Image ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition transform hover:scale-110"
                                            title="Hapus foto"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500 bg-gray-50">
                            Belum ada foto yang ditambahkan.
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t border-stroke">
                    <Link
                        href="/dashboard/galleries"
                        className="flex w-full justify-center rounded border border-stroke bg-gray-100 p-3 font-medium text-black transition hover:bg-gray-200"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
                    >
                        {loading ? "Menyimpan..." : (isEdit ? "Update Album" : "Simpan Album")}
                    </button>
                </div>
            </div>
        </form>
    )
}
