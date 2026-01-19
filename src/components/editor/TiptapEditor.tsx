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
                    'min-h-[300px] w-full outline-none prose prose-sm max-w-none',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    return (
        <div className="rounded border-[1.5px] border-stroke bg-transparent font-medium outline-none transition-colors focus-within:border-emerald-600 active:border-emerald-600">
            <Toolbar editor={editor} />
            <div className="border-t border-stroke p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
