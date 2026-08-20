'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useEffect, useRef } from 'react'

interface GutenbergBlockEditorProps {
    content: string
    onChange: (richText: string) => void
}

export default function GutenbergBlockEditorInternal({ content, onChange }: GutenbergBlockEditorProps) {
    const isInitialMount = useRef(true)

    // Configure BlockNote with custom image file uploader (computer upload to Cloudinary)
    const editor = useCreateBlockNote({
        uploadFile: async (file: File) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'webmadrasah_preset')

            try {
                const res = await fetch('https://api.cloudinary.com/v1_1/dgx0p6axm/image/upload', {
                    method: 'POST',
                    body: formData,
                })
                const data = await res.json()
                if (data.secure_url) {
                    return data.secure_url
                }
            } catch (e) {
                console.error("Cloudinary upload error, falling back to FileReader:", e)
            }

            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = (err) => reject(err)
                reader.readAsDataURL(file)
            })
        }
    })

    // Initialize HTML content into editor on initial load
    useEffect(() => {
        if (!editor) return

        async function loadInitialHTML() {
            if (content && isInitialMount.current) {
                isInitialMount.current = false
                try {
                    const blocks = await editor.tryParseHTMLToBlocks(content)
                    if (blocks && blocks.length > 0) {
                        editor.replaceBlocks(editor.document, blocks)
                    }
                } catch (err) {
                    console.error("Error parsing initial HTML to blocks:", err)
                }
            }
        }

        loadInitialHTML()
    }, [editor, content])

    // Convert blocks to HTML whenever editor content changes
    const handleChange = async () => {
        if (!editor) return
        try {
            const html = await editor.blocksToHTMLLossy(editor.document)
            onChange(html)
        } catch (err) {
            console.error("Error converting blocks to HTML:", err)
        }
    }

    return (
        <div className="gutenberg-block-editor border border-slate-300 rounded-xl bg-white p-4 shadow-sm min-h-[400px]">
            <BlockNoteView
                editor={editor}
                onChange={handleChange}
                theme="light"
            />
        </div>
    )
}
