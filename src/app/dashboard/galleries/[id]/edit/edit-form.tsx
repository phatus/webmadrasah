'use client'

import { updateGallery } from "@/actions/academic"
import { useFormStatus } from "react-dom"
import { useState } from "react"
import ImageUpload from "@/components/ui/ImageUpload"
import { CldUploadWidget } from "next-cloudinary"
import { Plus, X, Save } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded bg-emerald-600 p-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
            {pending ? (
                <>Menyimpan...</>
            ) : (
                <>
                    <Save className="h-5 w-5 mr-2" />
                    Simpan Perubahan
                </>
            )}
        </button>
    )
}

interface EditGalleryFormProps {
    gallery: {
        id: number
        title: string
        description: string | null
        cover: string | null
        images: string
    }
}

export default function EditGalleryForm({ gallery }: EditGalleryFormProps) {
    const [cover, setCover] = useState(gallery.cover || "")
    const initialImages = gallery.images ? JSON.parse(gallery.images) : []
    const [images, setImages] = useState<string[]>(initialImages)

    const updateWithId = updateGallery.bind(null, gallery.id)

    const addImage = (url: string) => {
        setImages(prev => [...prev, url])
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    return (
        <form action={updateWithId} className="space-y-6">

            {/* Hidden inputs */}
            <input type="hidden" name="images" value={JSON.stringify(images)} />
            <input type="hidden" name="cover" value={cover} />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Album</label>
                <input
                    type="text"
                    name="title"
                    defaultValue={gallery.title}
                    required
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Kegiatan Peringatan HUT RI..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
                <textarea
                    name="description"
                    defaultValue={gallery.description || ""}
                    rows={2}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Keterangan singkat..."
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cover Section */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cover Album</label>
                    <ImageUpload
                        value={cover}
                        onChange={(url) => setCover(url)}
                        onRemove={() => setCover("")}
                    />
                </div>

                {/* Gallery Images Section */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Foto-foto Kegiatan</label>

                    <div className="grid grid-cols-3 gap-2 mb-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded overflow-hidden group border border-slate-200">
                                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <CldUploadWidget
                        uploadPreset="webmadrasah_preset"
                        onSuccess={(result: any) => {
                            if (result.event === 'success') {
                                addImage(result.info.secure_url)
                            }
                        }}
                        options={{ maxFiles: 10, multiple: true }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors flex flex-col items-center gap-2"
                            >
                                <Plus className="w-6 h-6" />
                                <span>Tambah Foto</span>
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>

            <div className="pt-4 border-t">
                <SubmitButton />
            </div>
        </form>
    )
}
