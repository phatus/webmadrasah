'use client'

import { useState } from "react"
import { deleteProgram } from "@/actions/featured-program"
import { Pencil, Trash2, Plus, BookOpen, Laptop, Languages, Trophy, Sparkles, Monitor, Globe, FileText } from "lucide-react"
import ProgramForm from "./ProgramForm"
import Image from "next/image"

// Map icon names to components (Duplicated but necessary for client rendering)
const iconMap: any = {
    BookOpen, Laptop, Languages, Trophy, Sparkles, Monitor, Globe, FileText
}

interface Program {
    id: number
    title: string
    description: string
    icon: string
    color: string
}

export default function ProgramList({ programs }: { programs: Program[] }) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProgram, setEditingProgram] = useState<Program | null>(null)

    const [isDeleting, setIsDeleting] = useState<number | null>(null)

    const handleDelete = async (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus program ini?")) {
            setIsDeleting(id)
            try {
                const result = await deleteProgram(id)
                if (result.error) {
                    alert(result.error)
                } else {
                    // Success, revalidation will update the list
                }
            } catch (e) {
                alert("Terjadi kesalahan saat menghapus data")
            } finally {
                setIsDeleting(null)
            }
        }
    }

    const handleEdit = (program: Program) => {
        setEditingProgram(program)
        setIsFormOpen(true)
    }

    const handleCreate = () => {
        setEditingProgram(null)
        setIsFormOpen(true)
    }

    const handleSuccess = () => {
        setIsFormOpen(false)
        setEditingProgram(null)
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Daftar Program Unggulan
                </h4>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 px-10 text-center font-medium text-white hover:bg-blue-700 lg:px-8 xl:px-10 transition-colors"
                >
                    <Plus size={20} />
                    Tambah Program
                </button>
            </div>

            {isFormOpen && (
                <div className="p-4 md:p-6 xl:p-7.5 border-t border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/20">
                    <ProgramForm
                        program={editingProgram || undefined}
                        onSuccess={handleSuccess}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </div>
            )}

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 hidden sm:flex items-center">
                    <p className="font-medium">Ikon</p>
                </div>
                <div className="col-span-3 sm:col-span-3 flex items-center">
                    <p className="font-medium">Judul & Deskripsi</p>
                </div>
                <div className="col-span-2 hidden sm:flex items-center">
                    <p className="font-medium">Tema</p>
                </div>
                <div className="col-span-2 sm:col-span-2 flex items-center justify-end">
                    <p className="font-medium">Aksi</p>
                </div>
            </div>

            {programs.length === 0 ? (
                <div className="py-8 text-center text-gray-500 border-t border-stroke dark:border-strokedark">
                    Belum ada program unggulan. Silakan tambahkan.
                </div>
            ) : (
                programs.map((program, key) => {
                    const Icon = iconMap[program.icon] || BookOpen
                    return (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 hover:bg-gray-50 dark:hover:bg-meta-4/10 transition-colors"
                            key={key}
                        >
                            <div className="col-span-1 hidden sm:flex items-center">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${program.color.split(' ')[0]} ${program.color.split(' ')[1]}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="col-span-3 sm:col-span-3 flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-black dark:text-white">
                                        {program.title}
                                    </p>
                                    <p className="text-xs text-black dark:text-white line-clamp-2 mt-1">
                                        {program.description}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2 hidden sm:flex items-center">
                                <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-medium border ${program.color.replace('bg-', 'bg-opacity-10 border-').replace('text-', 'text-')}`}>
                                    Example Theme
                                </span>
                            </div>
                            <div className="col-span-2 sm:col-span-2 flex items-center justify-end space-x-3.5">
                                <button
                                    onClick={() => handleEdit(program)}
                                    className="hover:text-primary"
                                    title="Edit"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(program.id)}
                                    className="hover:text-red-500 disabled:opacity-50"
                                    title="Hapus"
                                    disabled={isDeleting === program.id}
                                >
                                    {isDeleting === program.id ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                                    ) : (
                                        <Trash2 size={18} />
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}
