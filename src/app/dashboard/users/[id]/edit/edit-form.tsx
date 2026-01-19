'use client'

import { updateUser } from "@/actions/user"
import { useFormStatus } from "react-dom"
import { useActionState, useState } from "react"
import ImageUpload from "@/components/ui/ImageUpload"
import { Save } from "lucide-react"

const initialState = {
    error: "",
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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

interface EditUserFormProps {
    user: any
}

export default function EditUserForm({ user }: EditUserFormProps) {
    const updateWithId = updateUser.bind(null, user.id)
    // @ts-ignore
    const [state, formAction] = useActionState(updateWithId, null as any)
    const [image, setImage] = useState(user.image || "")

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="image" value={image} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-black mb-2">
                        Foto User
                    </label>
                    <ImageUpload
                        value={image}
                        onChange={(url) => setImage(url)}
                        onRemove={() => setImage("")}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-black mb-2">Nama Lengkap</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={user.name}
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 active:border-blue-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        defaultValue={user.username}
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 active:border-blue-600"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">
                    Password Baru (Opsional)
                </label>
                <input
                    type="password"
                    name="password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 active:border-blue-600"
                    placeholder="Biarkan kosong jika tidak ingin mengganti password"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">Bio / Jabatan</label>
                <textarea
                    name="bio"
                    defaultValue={user.bio || ""}
                    rows={3}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 active:border-blue-600"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">Role</label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                        name="role"
                        defaultValue={user.role || "EDITOR"}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g opacity="0.8">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                    fill=""
                                ></path>
                            </g>
                        </svg>
                    </span>
                </div>
            </div>

            {state?.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-md">
                    {state.error}
                </div>
            )}

            <div className="pt-4 border-t">
                <SubmitButton />
            </div>
        </form>
    )
}
