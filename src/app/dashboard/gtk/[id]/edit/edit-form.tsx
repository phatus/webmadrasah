'use client'

import { updateTeacher } from "@/actions/teacher"
import { useFormStatus } from "react-dom"
import { useActionState, useState } from "react"
import ImageUpload from "@/components/ui/ImageUpload"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const initialState = {
    message: null,
    errors: {}
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded bg-emerald-600 p-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
            {pending ? (
                <>Menyimpan...</>
            ) : (
                <>
                    <Save className="h-5 w-5 mr-2" />
                    Simpan Perubahan
                </>
            )}
        </button>
    )
}

interface EditTeacherFormProps {
    teacher: any
}

export default function EditTeacherForm({ teacher }: EditTeacherFormProps) {
    const updateWithId = updateTeacher.bind(null, teacher.id)
    // @ts-ignore
    const [state, formAction] = useActionState(updateWithId, null as any)
    const [imageUrl, setImageUrl] = useState(teacher.image || "")

    return (
        <div className="space-y-6">
            <Link href="/dashboard/gtk" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
            </Link>

            <form action={formAction} className="bg-white p-6 rounded-lg shadow-sm space-y-6">

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Foto Profil</label>
                    <div className="flex flex-col gap-2">
                        <ImageUpload
                            value={imageUrl}
                            onChange={(value) => setImageUrl(value)}
                            onRemove={() => setImageUrl("")}
                        />
                        <input type="hidden" name="image" value={imageUrl} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        defaultValue={teacher.name}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="nip" className="block text-sm font-medium text-gray-700">NIP (Opsional)</label>
                    <input
                        type="text"
                        name="nip"
                        id="nip"
                        defaultValue={teacher.nip || ''}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">Jabatan</label>
                    <select
                        name="position"
                        id="position"
                        defaultValue={teacher.position}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="Kepala Madrasah">Kepala Madrasah</option>
                        <option value="Wakil Kepala">Wakil Kepala</option>
                        <option value="Guru Mapel">Guru Mapel</option>
                        <option value="Wali Kelas">Wali Kelas</option>
                        <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                        <option value="Bimbingan Konseling">Bimbingan Konseling</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Mata Pelajaran (Jika Guru)</label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        defaultValue={teacher.subject || ''}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                {state?.error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                        {state.error}
                    </div>
                )}

                <div className="pt-4">
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    )
}
