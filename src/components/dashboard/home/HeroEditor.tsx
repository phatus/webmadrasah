'use client'

import { updateHero } from "@/actions/home-editor"
import { useActionState } from "react"
import { useState } from "react"
import Image from "next/image"
import { CldUploadWidget } from 'next-cloudinary'

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
    let meta = {}
    try {
        if (initialData?.meta) {
            meta = JSON.parse(initialData.meta)
        }
    } catch (e) {
        console.error("Error parsing hero meta:", e)
    }

    // @ts-ignore
    const [imageUrl, setImageUrl] = useState(meta.image || "")

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Edit Hero Section
                </h3>
            </div>
            <form action={formAction}>
                <div className="p-6.5">
                    {/* Hero Image Upload */}
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Hero Image
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
                                                    alt="Hero"
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-primary">Click to upload</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                        </CldUploadWidget>
                        <input type="hidden" name="image" value={imageUrl} />
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

                    {/* Secondary Button fields can be added similarly if needed */}

                    {state?.error && (
                        <div className="mb-4 text-sm text-red-600">
                            {state.error}
                        </div>
                    )}

                    {state?.success && (
                        <div className="mb-4 text-sm text-green-600">
                            {state.success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    )
}
