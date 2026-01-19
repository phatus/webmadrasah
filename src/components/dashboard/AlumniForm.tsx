'use client'

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { createAlumni, updateAlumni } from "@/actions/alumni"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import Link from "next/link"
import { Upload, X, User } from "lucide-react"

interface AlumniFormProps {
    data?: {
        id: number
        name: string
        graduationYear: number
        currentStatus: string | null
        institution: string | null
        image: string | null
        phone: string | null
        email: string | null
        isVerified: boolean
    }
    isAdmin?: boolean // To show toggle verification
}

export default function AlumniForm({ data, isAdmin = true }: AlumniFormProps) {
    const isEdit = !!data
    const action = isEdit ? updateAlumni.bind(null, data.id) : createAlumni
    const [state, formAction] = useFormState(action, null as any)

    // For Image Upload
    const [imageUrl, setImageUrl] = useState(data?.image || "")

    return (
        <form action={formAction} className="rounded-sm border border-stroke bg-white shadow-default">
            {isAdmin && (
                <div className="border-b border-stroke py-4 px-6.5">
                    <h3 className="font-medium text-black">
                        {isEdit ? "Edit Data Alumni" : "Tambah Data Alumni"}
                    </h3>
                </div>
            )}

            <div className={`p-6.5 ${!isAdmin ? "pt-0" : ""}`}>
                {state?.error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600 border border-red-200">
                        {state.error}
                    </div>
                )}
                {state?.success && state.message && (
                    <div className="mb-4 rounded bg-emerald-100 p-3 text-sm text-emerald-600 border border-emerald-200">
                        {state.message}
                    </div>
                )}

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Foto Profil (Opsional)
                    </label>
                    <input type="hidden" name="image" value={imageUrl} />

                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border border-stroke bg-gray-100 flex items-center justify-center">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User size={32} className="text-gray-400" />
                            )}
                        </div>
                        <CldUploadWidget
                            uploadPreset="webmadrasah_preset"
                            onSuccess={(result: any) => {
                                setImageUrl(result.info.secure_url)
                            }}
                            options={{
                                maxFiles: 1,
                                resourceType: "image",
                                clientAllowedFormats: ["image"],
                                cropping: true,
                                croppingAspectRatio: 1,
                            }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="flex cursor-pointer items-center justify-center rounded border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                                >
                                    <Upload size={16} className="mr-2" />
                                    Upload Foto
                                </button>
                            )}
                        </CldUploadWidget>
                        {imageUrl && (
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="text-red-500 hover:underline text-sm"
                            >
                                Hapus
                            </button>
                        )}
                    </div>
                </div>

                <div className="mb-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="mb-2.5 block text-black">
                            Nama Lengkap <span className="text-meta-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={data?.name}
                            placeholder="Nama Lengkap"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2.5 block text-black">
                            Tahun Lulus <span className="text-meta-1">*</span>
                        </label>
                        <input
                            type="number"
                            name="graduationYear"
                            defaultValue={data?.graduationYear}
                            placeholder="Contoh: 2020"
                            min="1980"
                            max={new Date().getFullYear() + 1}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="mb-2.5 block text-black">
                            Status Saat Ini
                        </label>
                        <select
                            name="currentStatus"
                            defaultValue={data?.currentStatus || "Bekerja"}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        >
                            <option value="Bekerja">Bekerja</option>
                            <option value="Kuliah">Kuliah</option>
                            <option value="Wirausaha">Wirausaha</option>
                            <option value="Mencari Kerja">Mencari Kerja</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-2.5 block text-black">
                            Institusi / Tempat Kerja
                        </label>
                        <input
                            type="text"
                            name="institution"
                            defaultValue={data?.institution || ""}
                            placeholder="Nama Perusahaan / Universitas"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                    </div>
                </div>

                <div className="mb-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="mb-2.5 block text-black">
                            Nomor HP / WA (Opsional)
                        </label>
                        <input
                            type="text"
                            name="phone"
                            defaultValue={data?.phone || ""}
                            placeholder="08..."
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                    </div>
                    <div>
                        <label className="mb-2.5 block text-black">
                            Email (Opsional)
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={data?.email || ""}
                            placeholder="email@example.com"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                    </div>
                </div>

                {isAdmin && (
                    <div className="mb-6">
                        <label className="flex cursor-pointer select-none items-center">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="isVerified"
                                    className="sr-only"
                                    defaultChecked={data?.isVerified ?? true}
                                />
                                <div className="block h-8 w-14 rounded-full bg-gray-200 bg-opacity-30 p-1"></div>
                                <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition"></div>
                            </div>
                            <span className="ml-3 text-black font-medium">Status Verifikasi (Tampilkan di Website)</span>
                        </label>
                        <style jsx>{`
                            input:checked ~ .dot {
                                transform: translateX(100%);
                                background-color: #10B981;
                            }
                        `}</style>
                    </div>
                )}

                <div className="flex gap-4 mt-6">
                    {isAdmin ? (
                        <>
                            <Link
                                href="/dashboard/alumni"
                                className="flex w-full justify-center rounded border border-stroke bg-gray-100 p-3 font-medium text-black transition hover:bg-gray-200"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700"
                            >
                                {isEdit ? "Update Data" : "Simpan Data"}
                            </button>
                        </>
                    ) : (
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded bg-emerald-600 p-3 font-medium text-white transition hover:bg-emerald-700"
                        >
                            Kirim Data Alumni
                        </button>
                    )}
                </div>
            </div>
        </form>
    )
}
