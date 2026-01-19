'use client'

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { createInquiry } from "@/actions/inquiry"
import { Send, Loader2, CheckCircle } from "lucide-react"
import { useEffect, useRef } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-4 text-center font-medium text-white hover:bg-emerald-700 transition disabled:opacity-70"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Mengirim...
                </>
            ) : (
                <>
                    <Send className="mr-2 h-5 w-5" />
                    Kirim Pesan
                </>
            )}
        </button>
    )
}

export default function ContactForm() {
    const [state, formAction] = useActionState(createInquiry, null)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset()
        }
    }, [state?.success])

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg md:p-10">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Kirim Pesan
            </h3>

            {state?.success && (
                <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-emerald-700 border border-emerald-100 flex items-center shadow-sm animate-in fade-in">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0" />
                    <p className="font-medium">{state.message}</p>
                </div>
            )}

            {state?.error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-100 animate-in fade-in">
                    <p className="font-medium">{state.error}</p>
                </div>
            )}

            <form ref={formRef} action={formAction}>
                <div className="mb-5">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Masukkan nama anda"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                        Alamat Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="contoh@email.com"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                        Subjek (Optional)
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="Judul pesan"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                        Pesan
                    </label>
                    <textarea
                        rows={5}
                        id="message"
                        name="message"
                        placeholder="Tulis pesan anda disini..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
                        required
                    ></textarea>
                </div>

                <SubmitButton />
            </form>
        </div>
    )
}
