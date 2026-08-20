'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

interface TiptapEditorProps {
    content: string
    onChange: (richText: string) => void
}

const GutenbergBlockEditor = dynamic(
    () => import('./GutenbergBlockEditorInternal'),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center min-h-[350px] sm:min-h-[400px] w-full rounded-xl border border-slate-300 bg-slate-50 text-slate-500 gap-2 p-6">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-sm font-medium">Memuat Editor Gutenberg...</span>
            </div>
        ),
    }
)

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    return <GutenbergBlockEditor content={content} onChange={onChange} />
}
