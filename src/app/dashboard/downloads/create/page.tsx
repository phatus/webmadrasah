'use client'

import { createDownload } from "@/actions/academic"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? 'Menyimpan...' : 'Simpan Dokumen'}
        </button>
    )
}

export default function CreateDownloadPage() {
    return (
        <div className="max-w-xl bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Upload Dokumen Baru</h1>

            <form action={async (formData) => {
                await createDownload(formData)
            }} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Judul Dokumen</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Contoh: Kalender Akademik 2024..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Link File (Google Drive / Cloudinary)</label>
                    <input
                        type="url"
                        name="fileUrl"
                        required
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://..."
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Disarankan upload file ke Google Drive lalu paste linknya di sini (pastikan akses 'Anyone with the link').
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                    <select
                        name="category"
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Umum">Umum</option>
                        <option value="SK">SK (Surat Keputusan)</option>
                        <option value="Formulir">Formulir</option>
                        <option value="Rapor">Rapor</option>
                        <option value="Kurikulum">Kurikulum</option>
                    </select>
                </div>

                <div className="pt-4 border-t">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
