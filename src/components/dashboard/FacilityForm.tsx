'use client'

import { useState } from "react"
import { useFormState } from "react-dom"
import { createFacility, updateFacility } from "@/actions/facility"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Upload, X } from "lucide-react"

interface FacilityFormProps {
    data?: {
        id: number
        name: string
        description: string | null
        image: string | null
    }
}

export default function FacilityForm({ data }: FacilityFormProps) {
    const isEdit = !!data
    const [imageUrl, setImageUrl] = useState(data?.image || "")

    // Bind ID for update action
    const action = isEdit ? updateFacility.bind(null, data.id) : createFacility
    const [state, formAction] = useFormState(action, null as any)

    return (
        <form action={formAction} className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
                <h3 className="font-medium text-black">
                    {isEdit ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}
                </h3>
            </div>

            <div className="p-6.5">
                {state?.error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600 border border-red-200">
                        {state.error}
                    </div>
                )}

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Nama Fasilitas <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={data?.name}
                        placeholder="Masukkan nama fasilitas"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                        required
                    />
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Deskripsi
                    </label>
                    <textarea
                        rows={4}
                        name="description"
                        defaultValue={data?.description || ""}
                        placeholder="Deskripsi singkat fasilitas"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                    ></textarea>
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Foto Fasilitas
                    </label>
                    <input type="hidden" name="image" value={imageUrl} />

                    <CldUploadWidget
                        uploadPreset="webmadrasah_preset"
                        onSuccess={(result: any) => {
                            setImageUrl(result.info.secure_url)
                        }}
                        options={{
                            maxFiles: 1,
                            resourceType: "image",
                            clientAllowedFormats: ["image"],
                            maxFileSize: 5000000, // 5MB
                        }}
                    >
                        {({ open }) => (
                            <div
                                onClick={() => open()}
                                className="relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-primary bg-gray-50 hover:bg-gray-100 transition"
                            >
                                {imageUrl ? (
                                    <div className="relative h-full w-full min-h-[200px]">
                                        <Image
                                            src={imageUrl}
                                            alt="Facility Image"
                                            fill
                                            className="object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setImageUrl("")
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload className="mb-2 h-10 w-10 text-primary" />
                                        <span className="text-sm font-medium text-black">
                                            Klik untuk upload foto
                                        </span>
                                        <span className="mt-1 text-xs text-gray-500">
                                            JPG, PNG, WebP (Max 5MB)
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </CldUploadWidget>
                </div>

                <div className="flex gap-4 mt-6">
                    <Link
                        href="/dashboard/sarana-prasarana"
                        className="flex w-full justify-center rounded border border-stroke bg-gray-100 p-3 font-medium text-black transition hover:bg-gray-200"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        {isEdit ? "Update Fasilitas" : "Simpan Fasilitas"}
                    </button>
                </div>
            </div>
        </form>
    )
}
