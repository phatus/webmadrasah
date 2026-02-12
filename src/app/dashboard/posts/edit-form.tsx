'use client'

import { updatePost } from "@/actions/post"
import { getCategories } from "@/actions/category"
import { useFormStatus } from "react-dom"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TiptapEditor from "@/components/editor/TiptapEditor"
import ImageUpload from "@/components/ui/ImageUpload"
import Link from "next/link"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded bg-emerald-600 p-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
            {pending ? 'Menyimpan...' : 'Update Berita'}
        </button>
    )
}

interface EditPostFormProps {
    post: {
        id: number
        title: string
        content: string
        excerpt: string | null
        image: string | null
        categoryId: number | null
        metaTitle: string | null
        metaDescription: string | null
        published: boolean
    }
}

export default function EditPostForm({ post }: EditPostFormProps) {
    const [content, setContent] = useState(post.content)
    const [imageUrl, setImageUrl] = useState(post.image || '')
    const [categories, setCategories] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    const handleSubmit = async (formData: FormData) => {
        formData.set('content', content)
        formData.set('image', imageUrl)

        await updatePost(post.id, formData)
        router.push('/dashboard/posts')
    }

    return (
        <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default">
                <div className="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
                    <h3 className="font-semibold text-black">
                        Edit Berita
                    </h3>
                    <Link
                        href="/dashboard/posts"
                        className="text-sm text-black hover:text-primary"
                    >
                        Batal
                    </Link>
                </div>
                <form action={handleSubmit}>
                    <div className="p-6.5">
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black">
                                    Judul
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    defaultValue={post.title}
                                    placeholder="Masukkan judul berita..."
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black">
                                    Kategori
                                </label>
                                <div className="relative z-20 bg-transparent">
                                    <select
                                        name="categoryId"
                                        defaultValue={post.categoryId || ""}
                                        className="relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-emerald-600 active:border-emerald-600"
                                    >
                                        <option value="">Pilih Kategori (Optional)</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
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
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Gambar Sampul
                            </label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={(url) => setImageUrl(url)}
                                onRemove={() => setImageUrl('')}
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black">
                                Ringkasan (Excerpt)
                            </label>
                            <input
                                type="text"
                                name="excerpt"
                                defaultValue={post.excerpt || ''}
                                placeholder="Ringkasan singkat pemberitaan..."
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 disabled:cursor-default disabled:bg-whiter"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="mb-2.5 block text-black">
                                Konten Berita
                            </label>
                            <TiptapEditor
                                content={content}
                                onChange={(newContent) => setContent(newContent)}
                            />
                        </div>

                        <details className="mb-6 bg-gray-50 p-4 rounded border border-stroke">
                            <summary className="font-medium text-black cursor-pointer">Pengaturan SEO (Optional)</summary>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="mb-2.5 block text-black text-sm">
                                        Meta Title
                                    </label>
                                    <input
                                        type="textarea"
                                        name="metaTitle"
                                        defaultValue={post.metaTitle || ''}
                                        placeholder="Judul khusus untuk Google..."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 text-sm bg-white"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Biarkan kosong jika ingin menggunakan judul berita asli.</p>
                                </div>
                                <div>
                                    <label className="mb-2.5 block text-black text-sm">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        rows={2}
                                        defaultValue={post.metaDescription || ''}
                                        placeholder="Deskripsi singkat pencarian..."
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-emerald-600 active:border-emerald-600 text-sm bg-white"
                                    ></textarea>
                                </div>
                            </div>
                        </details>

                        <div className="mb-6">
                            <label className="flex items-center cursor-pointer select-none group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="published"
                                        defaultChecked={post.published}
                                        className="sr-only"
                                    />
                                    <div className="block h-8 w-14 rounded-full bg-slate-200"></div>
                                    <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition group-has-[:checked]:translate-x-full group-has-[:checked]:bg-emerald-600"></div>
                                </div>
                                <div className="ml-3 text-black font-medium">
                                    Publikasikan Sekarang
                                </div>
                            </label>
                        </div>

                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
