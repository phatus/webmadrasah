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

interface PageEditorProps {
    pageKey: string
    initialTitle: string
    initialContent: string
    label: string
}

export default function PageEditor({ pageKey, initialTitle, initialContent, label }: PageEditorProps) {
    const updateWithKey = updatePageContent.bind(null, pageKey)
    // @ts-ignore
    const [state, formAction] = useActionState(updateWithKey, null as any)
    const [content, setContent] = useState(initialContent)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit {label}</h1>

            <form action={formAction} className="bg-white p-6 rounded-lg shadow-sm space-y-6">

                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Halaman</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={initialTitle}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Konten</label>
                    <TiptapEditor content={content} onChange={setContent} />
                    <input type="hidden" name="content" value={content} />
                </div>

                {state?.error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                        {state.error}
                    </div>
                )}
                {state?.success && (
                    <div className="p-3 bg-green-50 text-green-600 text-sm rounded-md">
                        {state.message}
                    </div>
                )}

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="inline-flex items-center bg-emerald-600 text-white py-2 px-6 rounded-md hover:bg-emerald-700">
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    )
}
