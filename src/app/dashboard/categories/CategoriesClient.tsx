'use client'

import { useState, useTransition } from "react"
import { Plus, Search, Pencil, Trash2, Tag, BookOpen, AlertCircle, CheckCircle, X, Loader2 } from "lucide-react"
import { createCategory, updateCategory, deleteCategory } from "@/actions/category"
import slugify from "slugify"

type Category = {
    id: number
    name: string
    slug: string
    _count: {
        posts: number
    }
}

export default function CategoriesClient({
    initialCategories
}: {
    initialCategories: Category[]
}) {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [searchQuery, setSearchQuery] = useState("")

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

    // Form inputs state
    const [formName, setFormName] = useState("")
    const [formSlug, setFormSlug] = useState("")
    const [isAutoSlug, setIsAutoSlug] = useState(true)

    // Status state
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    // Filter categories by search
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Open create modal
    const handleOpenCreateModal = () => {
        setFormName("")
        setFormSlug("")
        setIsAutoSlug(true)
        setErrorMessage(null)
        setIsCreateModalOpen(true)
    }

    // Open edit modal
    const handleOpenEditModal = (cat: Category) => {
        setEditingCategory(cat)
        setFormName(cat.name)
        setFormSlug(cat.slug)
        setIsAutoSlug(false)
        setErrorMessage(null)
    }

    // Open delete confirmation modal
    const handleOpenDeleteModal = (cat: Category) => {
        setDeletingCategory(cat)
        setErrorMessage(null)
    }

    // Handle Name change in form (auto slug)
    const handleNameChange = (val: string) => {
        setFormName(val)
        if (isAutoSlug) {
            const autoSlug = slugify(val, { lower: true, strict: true })
            setFormSlug(autoSlug)
        }
    }

    // Handle form submit for Create
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        const formData = new FormData()
        formData.append("name", formName)
        formData.append("slug", formSlug)

        startTransition(async () => {
            const result = await createCategory(formData)
            if (result.success && result.category) {
                const newCat: Category = {
                    id: result.category.id,
                    name: result.category.name,
                    slug: result.category.slug,
                    _count: { posts: 0 }
                }
                setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)))
                setIsCreateModalOpen(false)
                setSuccessMessage(`Kategori "${result.category.name}" berhasil dibuat!`)
                setTimeout(() => setSuccessMessage(null), 4000)
            } else {
                setErrorMessage(result.error || "Gagal membuat kategori.")
            }
        })
    }

    // Handle form submit for Update
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCategory) return
        setErrorMessage(null)

        const formData = new FormData()
        formData.append("name", formName)
        formData.append("slug", formSlug)

        startTransition(async () => {
            const result = await updateCategory(editingCategory.id, formData)
            if (result.success && result.category) {
                setCategories(prev => prev.map(c =>
                    c.id === editingCategory.id
                        ? { ...c, name: result.category!.name, slug: result.category!.slug }
                        : c
                ))
                setEditingCategory(null)
                setSuccessMessage(`Kategori "${result.category.name}" berhasil diperbarui!`)
                setTimeout(() => setSuccessMessage(null), 4000)
            } else {
                setErrorMessage(result.error || "Gagal memperbarui kategori.")
            }
        })
    }

    // Handle Delete confirmation
    const handleDeleteConfirm = async () => {
        if (!deletingCategory) return
        setErrorMessage(null)

        startTransition(async () => {
            const result = await deleteCategory(deletingCategory.id)
            if (result.success) {
                setCategories(prev => prev.filter(c => c.id !== deletingCategory.id))
                setSuccessMessage(`Kategori "${deletingCategory.name}" berhasil dihapus.`)
                setDeletingCategory(null)
                setTimeout(() => setSuccessMessage(null), 4000)
            } else {
                setErrorMessage(result.error || "Gagal menghapus kategori.")
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Header & Toast Messages */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm font-medium">{successMessage}</p>
                </div>
            )}

            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Tag className="w-6 h-6 text-emerald-600" />
                        Manajemen Kategori Berita
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Kelola kategori berita dan artikel madrasah ({categories.length} total kategori)
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 active:bg-emerald-800 transition shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Kategori
                    </button>
                </div>
            </div>

            {/* Search Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari kategori berdasarkan nama atau slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nama Kategori</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-center">Jumlah Artikel</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-700 border border-slate-200 font-mono">
                                                {cat.slug}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                cat._count.posts > 0 
                                                    ? 'bg-emerald-100 text-emerald-800' 
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {cat._count.posts} Artikel
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(cat)}
                                                    className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                                                    title="Edit Kategori"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(cat)}
                                                    className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
                                                    title="Hapus Kategori"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery ? (
                                            <div>
                                                <p className="font-medium text-slate-700">Tidak ada kategori yang cocok dengan "{searchQuery}"</p>
                                                <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lain.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-slate-700">Belum ada kategori terdaftar</p>
                                                <button
                                                    onClick={handleOpenCreateModal}
                                                    className="mt-3 text-xs text-emerald-600 hover:underline font-semibold"
                                                >
                                                    + Tambah Kategori Pertama
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Create Category */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-emerald-600" />
                                Tambah Kategori Baru
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                            {errorMessage && (
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Pengumuman, Akreditasi, Prestasi"
                                    value={formName}
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
                                    placeholder="pengumuman-sekolah"
                                    value={formSlug}
                                    onChange={(e) => setFormSlug(e.target.value)}
                                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        isAutoSlug ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-white border-slate-300"
                                    }`}
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Slug digunakan untuk URL kategori (contoh: /berita/kategori/{formSlug || "nama-slug"})
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending || !formName.trim()}
                                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition"
                                >
                                    {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Simpan Kategori
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Category */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Pencil className="w-5 h-5 text-emerald-600" />
                                Edit Kategori
                            </h3>
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            {errorMessage && (
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
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
                                    value={formSlug}
                                    onChange={(e) => setFormSlug(e.target.value)}
                                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                        isAutoSlug ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-white border-slate-300"
                                    }`}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending || !formName.trim()}
                                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition"
                                >
                                    {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Delete Confirmation */}
            {deletingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50">
                            <h3 className="font-bold text-red-800 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                Konfirmasi Hapus Kategori
                            </h3>
                            <button
                                onClick={() => setDeletingCategory(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {errorMessage ? (
                                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                                    <p className="font-semibold mb-1">Gagal Menghapus:</p>
                                    <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-slate-700">
                                        Apakah Anda yakin ingin menghapus kategori <strong className="text-slate-900">"{deletingCategory.name}"</strong>?
                                    </p>
                                    {deletingCategory._count.posts > 0 && (
                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                            <strong>Peringatan:</strong> Kategori ini saat ini digunakan oleh {deletingCategory._count.posts} artikel. Kategori tidak dapat dihapus sebelum artikel dipindahkan atau dihapus.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setDeletingCategory(null)}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                >
                                    {errorMessage ? "Tutup" : "Batal"}
                                </button>
                                {!errorMessage && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteConfirm}
                                        disabled={isPending}
                                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition"
                                    >
                                        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        Ya, Hapus
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
