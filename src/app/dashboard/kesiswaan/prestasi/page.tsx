
import Link from "next/link"
import { getAchievements, deleteAchievement } from "@/actions/achievement"
import { Plus, Pencil, Trash2, Trophy, Medal } from "lucide-react"
import Image from "next/image"

export const metadata = {
    title: "Manajemen Prestasi | Web Madrasah",
}

export default async function PrestasiPage() {
    const { achievements } = await getAchievements()

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Daftar Prestasi Siswa & Guru
                </h2>
                <Link
                    href="/dashboard/kesiswaan/prestasi/create"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 px-10 text-center font-medium text-white hover:bg-blue-700 lg:px-8 xl:px-10"
                >
                    <Plus />
                    Tambah Prestasi
                </Link>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Semua Prestasi
                    </h4>
                </div>

                <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-3 flex items-center">
                        <p className="font-medium">Prestasi</p>
                    </div>
                    <div className="col-span-2 hidden items-center sm:flex">
                        <p className="font-medium">Kategori/Level</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="font-medium">Tanggal</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                        <p className="font-medium">Aksi</p>
                    </div>
                </div>

                {achievements && achievements.length > 0 ? (
                    achievements.map((item: any, key: number) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center"
                            key={key}
                        >
                            <div className="col-span-3 flex items-center gap-4">
                                <div className="h-12.5 w-15 rounded-md overflow-hidden bg-gray-100 relative shrink-0">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Trophy size={20} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-black dark:text-white hover:text-primary transition-colors line-clamp-1">
                                        {item.title}
                                    </p>
                                    <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 w-fit">
                                        <Medal size={10} />
                                        {item.rank}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex flex-col items-start gap-1">
                                <span className="text-sm text-black dark:text-white">
                                    {item.category}
                                </span>
                                <span className="text-xs text-black dark:text-white bg-gray-100 px-2 py-0.5 rounded">
                                    {item.level}
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-black dark:text-white">
                                    {new Date(item.date).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center justify-end gap-2">
                                <Link
                                    href={`/dashboard/kesiswaan/prestasi/${item.id}/edit`}
                                    className="hover:text-primary"
                                >
                                    <Pencil size={18} />
                                </Link>
                                <form action={async () => {
                                    'use server'
                                    await deleteAchievement(item.id)
                                }}>
                                    <button className="hover:text-red-600">
                                        <Trash2 size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        Belum ada data prestasi.
                    </div>
                )}
            </div>
        </div>
    )
}
