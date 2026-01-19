'use client'

import { type Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Quote,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    ImageIcon,
    Youtube as YoutubeIcon,
} from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

type Props = {
    editor: Editor | null
}

export function Toolbar({ editor }: Props) {
    if (!editor) {
        return null
    }

    return (
        <div className="border border-input bg-transparent rounded-t-md p-2 flex flex-wrap gap-2 border-b-0">

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor.isActive('bold') ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor.isActive('italic') ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Blockquote"
            >
                <Quote className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => {
                    const previousUrl = editor.getAttributes('link').href
                    const url = window.prompt('URL', previousUrl)
                    if (url === null) return
                    if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run()
                        return
                    }
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                }}
                className={`p-2 rounded ${editor.isActive('link') ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Add Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>

            <CldUploadWidget
                uploadPreset="webmadrasah_preset"
                onSuccess={(result: any) => {
                    if (result.event === 'success') {
                        editor.chain().focus().setImage({ src: result.info.secure_url }).run()
                    }
                }}
                options={{
                    maxFiles: 1,
                    sources: ['local', 'url'],
                    multiple: false
                }}
            >
                {({ open }) => {
                    return (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="p-2 rounded text-slate-500 hover:bg-slate-100"
                            title="Insert Image"
                        >
                            <ImageIcon className="w-4 h-4" />
                        </button>
                    )
                }}
            </CldUploadWidget>

            <button
                type="button"
                onClick={() => {
                    const url = window.prompt('YouTube URL')
                    if (url) {
                        editor.commands.setYoutubeVideo({ src: url })
                    }
                }}
                className={`p-2 rounded ${editor.isActive('youtube') ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Insert YouTube"
            >
                <YoutubeIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Align Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                title="Justify"
            >
                <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>

        </div>
    )
}
