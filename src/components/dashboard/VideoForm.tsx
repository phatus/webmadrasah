'use client'

import { createVideo } from "@/actions/video"
import { useFormStatus } from "react-dom"
import { Loader2, Video as VideoIcon } from "lucide-react"
import { useState } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
        >
            {pending ? <Loader2 className="animate-spin mr-2" /> : <VideoIcon className="mr-2" size={20} />}
            Simpan Video
        </button>
    )
}

export default function VideoForm() {
    const [message, setMessage] = useState<string>('')

    async function clientAction(formData: FormData) {
        setMessage('')
        const res = await createVideo(formData)
        if (res?.error) {
            setMessage(res.error)
            // alert(res.error)
        } else {
            // alert(res.message)
            // Reset form? useActionState is better but for simple form, standard reload or ref reset
            // Just clearing message on success
            // In a real app we'd use useActionState to reset form key
            (document.getElementById('videoForm') as HTMLFormElement).reset()
        }
    }

    return (
        <form id="videoForm" action={clientAction} className="p-6.5">
            <div className="mb-4.5">
                <label className="mb-2.5 block text-black">
                    Judul Video <span className="text-meta-1">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    placeholder="Masukkan judul video..."
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
            </div>

            <div className="mb-4.5">
                <label className="mb-2.5 block text-black">
                    URL Youtube <span className="text-meta-1">*</span>
                </label>
                <input
                    type="url"
                    name="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                />
            </div>

            {message && (
                <div className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded">
                    {message}
                </div>
            )}

            <SubmitButton />
        </form>
    )
}
