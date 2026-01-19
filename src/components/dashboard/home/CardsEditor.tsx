'use client'

import { updateCards } from "@/actions/home-editor"
import { useState } from "react"
import { Trash2, Plus, Monitor, BookOpen, Trophy } from "lucide-react"

type CardData = {
    title: string;
    description: string;
    link: string;
    icon: string;
    color: string;
}

const DEFAULT_CARDS: CardData[] = [
    {
        title: "E-Learning",
        description: "Akses materi pembelajaran dan tugas secara online/daring.",
        link: "https://elearning.kemenag.go.id/",
        icon: "Monitor",
        color: "green"
    },
    {
        title: "Raport Digital",
        description: "Cek hasil belajar dan raport siswa secara berkala melalui RDM.",
        link: "https://rdm.kemenag.go.id/",
        icon: "BookOpen",
        color: "amber"
    },
    {
        title: "Prestasi",
        description: "Daftar prestasi siswa dan guru MTsN 1 Pacitan di berbagai bidang.",
        link: "/prestasi",
        icon: "Trophy",
        color: "green"
    }
]

export default function CardsEditor({ initialData }: { initialData: any }) {
    // Parse initial card data from meta
    let parsedCards = DEFAULT_CARDS
    try {
        if (initialData?.meta) {
            const parsed = JSON.parse(initialData.meta)
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsedCards = parsed
            }
        }
    } catch (e) {
        console.error("Error parsing cards meta:", e)
    }

    const [cards, setCards] = useState<CardData[]>(parsedCards)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleCardChange = (index: number, field: keyof CardData, value: string) => {
        const newCards = [...cards]
        newCards[index] = { ...newCards[index], [field]: value }
        setCards(newCards)
    }

    const handleSubmit = async () => {
        setIsSaving(true)
        setMessage(null)

        try {
            const result = await updateCards(cards)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: "Cards updated successfully!" })
            }
        } catch (error) {
            setMessage({ type: 'error', text: "An unexpected error occurred." })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    Edit Info Cards (E-Learning, RDM, etc.)
                </h3>
            </div>

            <div className="p-6.5">
                <div className="flex flex-col gap-6">
                    {cards.map((card, index) => (
                        <div key={index} className="p-4 border border-stroke rounded-lg dark:border-strokedark bg-gray-50 dark:bg-meta-4">
                            <h4 className="mb-3 font-semibold text-sm uppercase text-gray-500">Card {index + 1}</h4>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                    Judul
                                </label>
                                <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                    Deskripsi
                                </label>
                                <textarea
                                    rows={2}
                                    value={card.description}
                                    onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                        Link URL
                                    </label>
                                    <input
                                        type="text"
                                        value={card.link}
                                        onChange={(e) => handleCardChange(index, 'link', e.target.value)}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                        Icon (Lucide Name)
                                    </label>
                                    <select
                                        value={card.icon}
                                        onChange={(e) => handleCardChange(index, 'icon', e.target.value)}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    >
                                        <option value="Monitor">Monitor (E-Learning)</option>
                                        <option value="BookOpen">BookOpen (Raport)</option>
                                        <option value="Trophy">Trophy (Prestasi)</option>
                                        <option value="Globe">Globe</option>
                                        <option value="FileText">FileText</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {message && (
                    <div className={`mt-4 mb-4 text-sm p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Semua Kartu'}
                    </button>
                </div>
            </div>
        </div>
    )
}
