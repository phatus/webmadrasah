'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertCircle, Pencil, Loader2 } from "lucide-react"
import { updateCategory } from "@/actions/category"
import slugify from "slugify"

type Category = {
    id: number
    name: string
    slug: string
    _count?: {
        posts: number
    }
}

export default function EditCategoryClient({ category }: { category: Category }) {
    const router = useRouter()
    const [name, setName] = useState(category.name)
    const [slug, setSlug] = useState(category.slug)
    const [isAutoSlug, setIsAutoSlug] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleNameChange = (val: string) => {
        setName(val)
        if (isAutoSlug) {
            setSlug(slugify(val, { lower: true, strict: true }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const formData = new FormData()
        formData.append("name", name)
        formData.append("slug", slug)

        startTransition(async () => {
            const res = await updateCategory(category.id, formData)
            if (res.success) {
                router.push("/dashboard/categories")
                router.refresh()
            } else {
                setError(res.error || "Gagal memperbarui kategori")
            }
        })
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/categories"
                    className="p-2 rounded-lg text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-emerald-600" />
                        Edit Kategori
                    </h1>
                    <p className="text-sm text-slate-500">Perbarui nama dan slug kategori berita</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                            Nama Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase text-slate-600">
                                Slug Kategori <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsAutoSlug(!isAutoSlug)}
                                className="text-xs text-emerald-600 hover:underline"
                            >
                                {isAutoSlug ? "Ubah Manual" : "Auto Slug"}
                            </button>
                        </div>
                        <input
                            type="text"
                            required
                            readOnly={isAutoSlug}
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                isAutoSlug ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-white border-slate-300"
                            }`}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Link
                            href="/dashboard/categories"
                            className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition"
                        >
                            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
