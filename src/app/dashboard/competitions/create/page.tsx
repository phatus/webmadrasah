'use client'

import { createCompetition } from "@/actions/competition"
import { useFormStatus } from "react-dom"
import { useState } from "react"
import { useRouter } from "next/navigation"
import TiptapEditor from "@/components/editor/TiptapEditor"
import ImageUpload from "@/components/ui/ImageUpload"
import Link from "next/link"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded bg-emerald-600 p-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
            {pending ? 'Menyimpan...' : 'Buat Lomba'}
        </button>
    )
}

export default function CreateCompetitionPage() {
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        formData.set('description', description)
        formData.set('image', imageUrl)

        const result = await createCompetition(formData)
        if (result?.error) {
            alert(result.error)
        } else {
            router.push('/dashboard/competitions')
        }
    }

    return (
        <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
                    <h3 className="font-semibold text-black">
                        Buat Lomba Baru
                    </h3>
                    <Link
                        href="/dashboard/competitions"
                        className="text-sm text-black hover:text-primary"
                    >
                        Batal
                    </Link>
                </div>
                <form action={handleSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Judul Lomba
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="Masukkan judul lomba..."
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black">
                                    Tanggal Mulai
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black">
                                    Tanggal Selesai
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600"
                                />
                            </div>
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Gambar Poster/Banner
                            </label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={(url) => setImageUrl(url)}
                                onRemove={() => setImageUrl('')}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="mb-2.5 block text-black">
                                Deskripsi & Ketentuan Lomba
                            </label>
                            <TiptapEditor
                                content={description}
                                onChange={(newContent) => setDescription(newContent)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center cursor-pointer select-none group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        defaultChecked
                                        className="sr-only"
                                    />
                                    <div className="block h-8 w-14 rounded-full bg-slate-200"></div>
                                    <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition group-has-[:checked]:translate-x-full group-has-[:checked]:bg-emerald-600"></div>
                                </div>
                                <div className="ml-3 text-black font-medium">
                                    Aktifkan Pendaftaran
                                </div>
                            </label>
                        </div>

                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
