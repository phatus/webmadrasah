'use client'

import { useActionState } from "react"
import { updatePageContent } from "@/actions/page-content"
import TiptapEditor from "@/components/editor/TiptapEditor"
import ImageUpload from "@/components/ui/ImageUpload"
import { useState, useEffect } from "react"
import { Save } from "lucide-react"

const initialState = {
    message: null,
    errors: {}
}

const DEFAULT_META = {
    headmasterName: "",
    headmasterPosition: "Kepala Madrasah",
    headmasterQuote: "",
    headmasterImage: ""
}

interface SambutanEditorProps {
    pageKey: string
    initialTitle: string
    initialContent: string
    initialMeta: string | null
    label: string
}

export default function SambutanEditor({ pageKey, initialTitle, initialContent, initialMeta, label }: SambutanEditorProps) {
    const updateWithKey = updatePageContent.bind(null, pageKey)
    // @ts-ignore
    const [state, formAction] = useActionState(updateWithKey, initialState)
    const [content, setContent] = useState(initialContent)

    // Parse initial meta or use defaults
    const [meta, setMeta] = useState(() => {
        try {
            return initialMeta ? { ...DEFAULT_META, ...JSON.parse(initialMeta) } : DEFAULT_META
        } catch (e) {
            return DEFAULT_META
        }
    })

    const handleMetaChange = (field: string, value: string) => {
        setMeta((prev: any) => ({ ...prev, [field]: value }))
    }

    return (
        <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="border-b border-stroke py-4 px-6.5">
                    <h3 className="font-semibold text-black">
                        Edit {label}
                    </h3>
                </div>

                <form action={formAction}>
                    <div className="p-6.5">
                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Judul Halaman
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={initialTitle}
                                required
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                            />
                        </div>

                        {/* Headmaster Profile Section */}
                        <div className="mb-6 p-4 bg-gray-50 border border-stroke rounded space-y-4">
                            <h4 className="font-medium text-black">Profil Kepala Madrasah</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-2.5 block text-black text-sm">
                                        Foto Kepala Madrasah
                                    </label>
                                    <ImageUpload
                                        value={meta.headmasterImage}
                                        onChange={(url) => handleMetaChange('headmasterImage', url)}
                                        onRemove={() => handleMetaChange('headmasterImage', '')}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2.5 block text-black text-sm">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={meta.headmasterName}
                                            onChange={(e) => handleMetaChange('headmasterName', e.target.value)}
                                            placeholder="Nama Kepala Madrasah..."
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2.5 block text-black text-sm">
                                            Jabatan
                                        </label>
                                        <input
                                            type="text"
                                            value={meta.headmasterPosition}
                                            onChange={(e) => handleMetaChange('headmasterPosition', e.target.value)}
                                            placeholder="e.g. Kepala MTsN 1 Pacitan"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black text-sm">
                                    Quote / Kutipan
                                </label>
                                <textarea
                                    value={meta.headmasterQuote}
                                    onChange={(e) => handleMetaChange('headmasterQuote', e.target.value)}
                                    rows={3}
                                    placeholder="Kutipan motivasi..."
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 bg-white"
                                ></textarea>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="mb-2.5 block text-black">
                                Konten Sambutan
                            </label>
                            <TiptapEditor content={content} onChange={setContent} />
                        </div>

                        {/* Hidden Inputs for Form Submission */}
                        <input type="hidden" name="content" value={content} />
                        <input type="hidden" name="meta" value={JSON.stringify(meta)} />

                        {state?.error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                                {state.error}
                            </div>
                        )}
                        {state?.success && (
                            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md">
                                {state.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded bg-emerald-600 p-3 font-medium text-white hover:bg-emerald-700"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
