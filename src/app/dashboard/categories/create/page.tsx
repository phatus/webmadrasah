'use client'

import { createCategory } from "@/actions/category"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? 'Menyimpan...' : 'Simpan Kategori'}
        </button>
    )
}

export default function CreateCategoryPage() {
    return (
        <div className="max-w-md bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Buat Kategori Baru</h1>

            <form action={async (formData) => {
                await createCategory(formData)
            }} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Kategori</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Contoh: Pengumuman, Prestasi..."
                    />
                </div>

                <div className="pt-4 border-t">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
