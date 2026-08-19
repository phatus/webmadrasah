'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { Toolbar } from './Toolbar'

interface TiptapEditorProps {
    content: string
    onChange: (richText: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2],
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Youtube.configure({
                controls: false,
            }),
        ],
        immediatelyRender: false,
        content: content,
        editorProps: {
            attributes: {
                className:
                    'min-h-[350px] sm:min-h-[400px] w-full outline-none focus:outline-none prose prose-slate max-w-none text-slate-800 text-base leading-relaxed',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    return (
        <div className="rounded-xl border border-slate-300 bg-white font-medium outline-none transition-all shadow-sm focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 overflow-hidden">
            <Toolbar editor={editor} />
            <div 
                className="p-4 sm:p-5 min-h-[380px] sm:min-h-[440px] cursor-text bg-white"
                onClick={() => editor?.commands.focus()}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
