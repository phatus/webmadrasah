
import Link from "next/link"
import { getExtracurriculars, deleteExtracurricular } from "@/actions/extracurricular"
import { Plus, Pencil, Trash2, Users, Calendar, MapPin } from "lucide-react"
import Image from "next/image"

export const metadata = {
    title: "Manajemen Ekstrakurikuler | Web Madrasah",
}

export default async function EkstrakurikulerManagerPage() {
    const { extracurriculars } = await getExtracurriculars()

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Manajemen Ekstrakurikuler
                </h2>
                <Link
                    href="/dashboard/ekstrakurikuler/create"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 px-10 text-center font-medium text-white hover:bg-blue-700 lg:px-8 xl:px-10"
                >
                    <Plus />
                    Tambah Ekstra
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {extracurriculars && extracurriculars.length > 0 ? (
                    extracurriculars.map((item, key) => (
                        <div key={key} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden group">
                            <div className="relative h-48 w-full bg-gray-100">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Users size={40} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/dashboard/ekstrakurikuler/${item.id}/edit`}
                                        className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-gray-100"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <form action={async () => {
                                        'use server'
                                        await deleteExtracurricular(item.id)
                                    }}>
                                        <button className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white text-red-600 shadow-sm hover:bg-gray-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
                                    {item.name}
                                </h4>
                                <div className="flex flex-col gap-1.5">
                                    {item.schedule && (
                                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar size={16} className="mt-0.5 shrink-0" />
                                            <span>{item.schedule}</span>
                                        </div>
                                    )}
                                    {item.location && (
                                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin size={16} className="mt-0.5 shrink-0" />
                                            <span>{item.location}</span>
                                        </div>
                                    )}
                                    {item.pembina && (
                                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Users size={16} className="mt-0.5 shrink-0" />
                                            <span>Pembina: {item.pembina}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-8 text-center bg-white rounded border border-dashed border-gray-300">
                        <p className="text-gray-500">Belum ada data ekstrakurikuler.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
