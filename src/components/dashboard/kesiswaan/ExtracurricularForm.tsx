'use client'

import { createExtracurricular, updateExtracurricular } from "@/actions/extracurricular"
import { useActionState } from "react"
import { useState } from "react"
import Image from "next/image"
import { CldUploadWidget } from 'next-cloudinary'

export default function ExtracurricularForm({ initialData, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
    // @ts-ignore
    const updateAction = isEdit ? updateExtracurricular.bind(null, initialData.id) : createExtracurricular
    // @ts-ignore
    const [state, formAction] = useActionState(updateAction, null)

    // @ts-ignore
    const [imageUrl, setImageUrl] = useState(initialData?.image || "")

    return (
        <form action={formAction}>
            <div className="p-6.5">
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Nama Ekstrakurikuler <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={initialData?.name}
                        placeholder="Contoh: Pramuka, PMR, Futsal"
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Jadwal Latihan
                        </label>
                        <input
                            type="text"
                            name="schedule"
                            defaultValue={initialData?.schedule}
                            placeholder="Contoh: Setiap Sabtu, 14.00 WIB"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <div className="w-full xl:w-1/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            name="location"
                            defaultValue={initialData?.location}
                            placeholder="Contoh: Lapangan Basket"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>

                    <div className="w-full xl:w-1/3">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Nama Pembina
                        </label>
                        <input
                            type="text"
                            name="pembina"
                            defaultValue={initialData?.pembina}
                            placeholder="Contoh: Bpk. Ahmad"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                    </div>
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={initialData?.description}
                        placeholder="Deskripsi kegiatan ekstrakurikuler..."
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Foto Kegiatan/Logo
                    </label>
                    <CldUploadWidget
                        uploadPreset="webmadrasah_preset"
                        onSuccess={(result: any) => {
                            setImageUrl(result.info.secure_url);
                        }}
                    >
                        {({ open }) => {
                            return (
                                <div
                                    onClick={() => open()}
                                    className="relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-gray dark:bg-meta-4"
                                >
                                    {imageUrl ? (
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={imageUrl}
                                                alt="Ekstra Image"
                                                fill
                                                className="object-contain rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-primary">Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    </CldUploadWidget>
                    <input type="hidden" name="image" value={imageUrl} />
                </div>

                {state?.error && (
                    <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {state.error}
                    </div>
                )}

                <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700"
                >
                    {isEdit ? "Update Ekstrakurikuler" : "Simpan Ekstrakurikuler"}
                </button>
            </div>
        </form>
    )
}
