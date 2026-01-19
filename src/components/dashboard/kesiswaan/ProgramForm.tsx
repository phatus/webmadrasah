'use client'

import { useState } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { createProgram, updateProgram } from "@/actions/featured-program"
import { Loader2, BookOpen, Laptop, Languages, Trophy, Sparkles, Monitor, Globe, FileText, Check, X } from "lucide-react"

// Available Icons
const ICONS = [
    { name: "BookOpen", component: BookOpen },
    { name: "Laptop", component: Laptop },
    { name: "Languages", component: Languages },
    { name: "Trophy", component: Trophy },
    { name: "Sparkles", component: Sparkles },
    { name: "Monitor", component: Monitor },
    { name: "Globe", component: Globe },
    { name: "FileText", component: FileText },
]

// Available Themes
const THEMES = [
    { name: "Emerald", value: "bg-emerald-100 text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-500" },
    { name: "Blue", value: "bg-blue-100 text-blue-600", border: "border-blue-200", bg: "bg-blue-500" },
    { name: "Orange", value: "bg-orange-100 text-orange-600", border: "border-orange-200", bg: "bg-orange-500" },
    { name: "Purple", value: "bg-purple-100 text-purple-600", border: "border-purple-200", bg: "bg-purple-500" },
    { name: "Red", value: "bg-red-100 text-red-600", border: "border-red-200", bg: "bg-red-500" },
    { name: "Cyan", value: "bg-cyan-100 text-cyan-600", border: "border-cyan-200", bg: "bg-cyan-500" },
]

interface ProgramFormProps {
    program?: {
        id: number
        title: string
        description: string
        icon: string
        color: string
    }
    onSuccess?: () => void
    onCancel?: () => void
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
        >
            {pending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {isEditing ? "Simpan Perubahan" : "Tambah Program"}
        </button>
    )
}

export default function ProgramForm({ program, onSuccess, onCancel }: ProgramFormProps) {
    const action = program ? updateProgram.bind(null, program.id) : createProgram
    const [state, formAction] = useActionState(action, null)

    // Initial state matching existing program or defaults
    const [selectedIcon, setSelectedIcon] = useState(program?.icon || "BookOpen")
    const [selectedTheme, setSelectedTheme] = useState(program?.color || THEMES[0].value)

    if (state?.success && onSuccess) {
        // Reset state or notify parent? 
        // Component might be unmounted by parent on success, but just in case
        setTimeout(onSuccess, 0)
    }

    return (
        <form action={formAction} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                <h3 className="font-medium text-black dark:text-white">
                    {program ? "Edit Program" : "Tambah Program Baru"}
                </h3>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="text-gray-500 hover:text-red-500">
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="p-6.5">
                {state?.error && (
                    <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
                        {state.error}
                    </div>
                )}

                {state?.message && !state.success && (
                    <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-600">
                        {state.message}
                    </div>
                )}

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Judul Program
                    </label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={program?.title}
                        placeholder="Contoh: Program Tahfidz"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                    />
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        defaultValue={program?.description}
                        rows={4}
                        placeholder="Deskripsi singkat program..."
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                    ></textarea>
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Pilih Ikon
                    </label>
                    <input type="hidden" name="icon" value={selectedIcon} />
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {ICONS.map((item) => (
                            <button
                                key={item.name}
                                type="button"
                                onClick={() => setSelectedIcon(item.name)}
                                className={`flex h-12 w-full items-center justify-center rounded border ${selectedIcon === item.name
                                    ? "border-primary bg-primary text-white"
                                    : "border-stroke hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                                    }`}
                                title={item.name}
                            >
                                <item.component size={20} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Pilih Tema Warna
                    </label>
                    <input type="hidden" name="color" value={selectedTheme} />
                    <div className="flex flex-wrap gap-3">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.name}
                                type="button"
                                onClick={() => setSelectedTheme(theme.value)}
                                className={`flex items-center gap-2 px-3 py-2 rounded border ${selectedTheme === theme.value
                                    ? "border-black ring-1 ring-black dark:border-white dark:ring-white"
                                    : "border-transparent"
                                    }`}
                            >
                                <div className={`h-6 w-6 rounded-full ${theme.bg}`}></div>
                                <span className="text-sm">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <SubmitButton isEditing={!!program} />
            </div>
        </form>
    )
}
