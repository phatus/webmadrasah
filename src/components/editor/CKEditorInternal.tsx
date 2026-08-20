'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

interface CKEditorInternalProps {
    content: string
    onChange: (richText: string) => void
}

export default function CKEditorInternal({ content, onChange }: CKEditorInternalProps) {
    return (
        <div className="ck-editor-wrapper">
            <CKEditor
                editor={ClassicEditor as any}
                data={content || ''}
                config={{
                    placeholder: 'Tuliskan isi artikel / berita lengkap di sini...',
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        'blockQuote',
                        '|',
                        'undo',
                        'redo',
                    ],
                }}
                onChange={(_event: any, editor: any) => {
                    const data = editor.getData()
                    onChange(data)
                }}
            />
        </div>
    )
}
