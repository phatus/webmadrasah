'use client'

import { useActionState } from "react"
import { updatePageContent } from "@/actions/page-content"
import TiptapEditor from "@/components/editor/TiptapEditor"
import { useState } from "react"
import { Save } from "lucide-react"

const initialState = {
    message: null,
    errors: {}
}

const DEFAULT_META = {
    description: "",
}

interface VisiMisiEditorProps {
    pageKey: string
    initialTitle: string
    initialContent: string
    initialMeta: string | null
    label: string
}

export default function VisiMisiEditor({ pageKey, initialTitle, initialContent, initialMeta, label }: VisiMisiEditorProps) {
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

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Deskripsi Singkat / Sub-judul
                            </label>
                            <textarea
                                value={meta.description}
                                onChange={(e) => handleMetaChange('description', e.target.value)}
                                rows={3}
                                placeholder="Contoh: Landasan cita-cita dan arah perjuangan..."
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Teks ini akan muncul di bawah judul halaman.
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="mb-2.5 block text-black">
                                Konten Utama
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
