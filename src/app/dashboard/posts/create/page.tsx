'use client'

import { createPost } from "@/actions/post"
import { getCategories } from "@/actions/category"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TiptapEditor from "@/components/editor/TiptapEditor"
import ImageUpload from "@/components/ui/ImageUpload"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"

export default function CreatePostPage() {
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [categories, setCategories] = useState<any[]>([])
    const [isPublished, setIsPublished] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage('')

        const formData = new FormData(e.currentTarget)
        formData.set('content', content)
        formData.set('image', imageUrl)
        if (isPublished) {
            formData.set('published', 'on')
        } else {
            formData.delete('published')
        }

        try {
            const res = await createPost(formData)
            if (res?.error) {
                setErrorMessage(res.error)
                setIsSubmitting(false)
            }
        } catch (err: any) {
            // NextJS redirect error signal
            if (err?.message !== 'NEXT_REDIRECT') {
                console.error(err)
                setErrorMessage('Terjadi kesalahan saat menyimpan berita.')
                setIsSubmitting(false)
            }
        }
    }

    return (
        <div className="flex flex-col gap-9">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 py-4 px-6 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-lg">
                        Tulis Berita Baru
                    </h3>
                    <Link
                        href="/dashboard/posts"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Batal
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6.5 space-y-6">
                        {errorMessage && (
                            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Judul Berita <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="Masukkan judul berita..."
                                    className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Kategori
                                </label>
                                <div className="relative bg-white">
                                    <select
                                        name="categoryId"
                                        className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                                    >
                                        <option value="">Pilih Kategori (Optional)</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <span className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
                                        <svg
                                            className="fill-slate-500"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M7 10l5 5 5-5z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Gambar Sampul
                            </label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={(url) => setImageUrl(url)}
                                onRemove={() => setImageUrl('')}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Ringkasan (Excerpt)
                            </label>
                            <input
                                type="text"
                                name="excerpt"
                                placeholder="Ringkasan singkat pemberitaan..."
                                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 text-slate-800 font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Konten Berita
                            </label>
                            <TiptapEditor
                                content={content}
                                onChange={(newContent) => setContent(newContent)}
                            />
                        </div>

                        <details className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <summary className="font-semibold text-slate-700 cursor-pointer">Pengaturan SEO (Opsional)</summary>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        placeholder="Judul khusus untuk Google..."
                                        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Biarkan kosong jika ingin menggunakan judul berita asli.</p>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        rows={2}
                                        placeholder="Deskripsi singkat pencarian..."
                                        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600"
                                    ></textarea>
                                </div>
                            </div>
                        </details>

                        {/* Interactive Controlled Toggle Switch */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <label className="flex items-center cursor-pointer select-none">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="published"
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`block h-8 w-14 rounded-full transition-colors duration-200 ${isPublished ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                                    <div className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-200 shadow-sm ${isPublished ? 'translate-x-6' : ''}`}></div>
                                </div>
                                <div className="ml-4 font-semibold text-sm text-slate-800">
                                    {isPublished ? (
                                        <span className="text-emerald-700">Publikasikan Sekarang <span className="text-xs text-slate-500 font-normal">(Berita langsung tampil publik di website)</span></span>
                                    ) : (
                                        <span className="text-slate-600">Simpan Draf <span className="text-xs text-slate-500 font-normal">(Belum dipublikasikan ke publik)</span></span>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Interactive Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3.5 px-6 font-bold text-white hover:bg-emerald-700 disabled:opacity-60 transition-all shadow-md hover:shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Menyimpan & Mempublikasikan Berita...</span>
                                </>
                            ) : (
                                <span>{isPublished ? 'Publikasikan Berita Sekarang' : 'Simpan Draf Berita'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
