'use client'

import { useFormState } from "react-dom"
import { createAnnouncement, updateAnnouncement } from "@/actions/announcement"
import Link from "next/link"
import { useState } from "react"

interface AnnouncementFormProps {
    data?: {
        id: number
        title: string
        content: string | null
        type: string
        isActive: boolean
        expiresAt: Date | null
    }
}

export default function AnnouncementForm({ data }: AnnouncementFormProps) {
    const isEdit = !!data
    const action = isEdit ? updateAnnouncement.bind(null, data.id) : createAnnouncement
    const [state, formAction] = useFormState(action, null as any)
    const [selectedType, setSelectedType] = useState(data?.type || "INFO")

    return (
        <form action={formAction} className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-6.5">
                <h3 className="font-medium text-black">
                    {isEdit ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
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
                        Judul Pengumuman <span className="text-meta-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={data?.title}
                        placeholder="Contoh: Penerimaan Peserta Didik Baru"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                        required
                    />
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Tipe Pengumuman
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: 'INFO', label: 'Info Biasa' },
                            { value: 'RUNNING_TEXT', label: 'Running Text (Atas Web)' },
                            { value: 'POPUP', label: 'Popup / Modal' },
                        ].map((type) => (
                            <label
                                key={type.value}
                                className={`flex cursor-pointer items-center justify-center rounded-md border p-4 text-center transition ${selectedType === type.value ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' : 'border-stroke hover:bg-gray-50'}`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value={type.value}
                                    className="sr-only"
                                    checked={selectedType === type.value}
                                    onChange={() => setSelectedType(type.value)}
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black">
                        Konten / Isi Pengumuman
                    </label>
                    <textarea
                        rows={4}
                        name="content"
                        defaultValue={data?.content || ""}
                        placeholder="Isi detail pengumuman..."
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                    ></textarea>
                </div>

                <div className="mb-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="mb-2.5 block text-black">
                            Masa Berlaku Sampai (Opsional)
                        </label>
                        <input
                            type="date"
                            name="expiresAt"
                            defaultValue={data?.expiresAt ? new Date(data.expiresAt).toISOString().split('T')[0] : ""}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                        />
                        <p className="mt-1 text-xs text-gray-500">Kosongkan jika berlaku selamanya</p>
                    </div>

                    <div className="flex items-center pt-8">
                        <label className="flex cursor-pointer select-none items-center">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    className="sr-only"
                                    defaultChecked={data?.isActive ?? true}
                                />
                                <div className="block h-8 w-14 rounded-full bg-gray-200 bg-opacity-30 p-1"></div>
                                <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition"></div>
                            </div>
                            <span className="ml-3 text-black font-medium">Aktifkan Pengumuman Ini</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <Link
                        href="/dashboard/announcements"
                        className="flex w-full justify-center rounded border border-stroke bg-gray-100 p-3 font-medium text-black transition hover:bg-gray-200"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        Simpan Pengumuman
                    </button>
                </div>
            </div>
            <style jsx>{`
                input:checked ~ .dot {
                    transform: translateX(100%);
                    background-color: #10B981;
                }
            `}</style>
        </form>
    )
}
