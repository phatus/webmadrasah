'use client'

import { createAgenda } from "@/actions/academic"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? 'Menyimpan...' : 'Simpan Agenda'}
        </button>
    )
}

export default function CreateAgendaPage() {
    return (
        <div className="max-w-xl bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Buat Agenda Baru</h1>

            <form action={async (formData) => {
                await createAgenda(formData)
            }} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Kegiatan</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Contoh: Rapat Wali Murid, Ujian Semester..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            required
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Lokasi</label>
                        <input
                            type="text"
                            name="location"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Contoh: Aula Madrasah"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi (Optional)</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Detail kegiatan..."
                    ></textarea>
                </div>

                <div className="pt-4 border-t">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
