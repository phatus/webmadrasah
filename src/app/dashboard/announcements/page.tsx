
import Link from "next/link"
import { getAnnouncements, deleteAnnouncement, toggleAnnouncementStatus } from "@/actions/announcement"
import { Plus, Pencil, Trash2, Calendar, Lock, Unlock, Megaphone, Monitor, AppWindow } from "lucide-react"

export const metadata = {
    title: "Kelola Pengumuman | Web Madrasah",
}

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'RUNNING_TEXT': return <Monitor size={18} className="text-blue-500" />
        case 'POPUP': return <AppWindow size={18} className="text-purple-500" />
        default: return <Megaphone size={18} className="text-emerald-500" />
    }
}

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-xl font-semibold text-black">
                        Pengumuman
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Kelola informasi, running text, dan popup website
                    </p>
                </div>
                <Link
                    href="/dashboard/announcements/create"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 px-10 text-center font-medium text-white hover:bg-blue-700 lg:px-8 xl:px-10"
                >
                    <Plus />
                    Buat Pengumuman
                </Link>
            </div>

            <div className="flex flex-col">
                {/* Header */}
                <div className="grid grid-cols-12 rounded-t-md bg-gray-100 p-4 border-b border-stroke">
                    <div className="col-span-5 md:col-span-6 pl-2">
                        <span className="font-medium text-black text-sm uppercase">Judul & Isi</span>
                    </div>
                    <div className="col-span-3 md:col-span-2 text-center">
                        <span className="font-medium text-black text-sm uppercase">Tipe</span>
                    </div>
                    <div className="col-span-2 md:col-span-2 text-center">
                        <span className="font-medium text-black text-sm uppercase">Status</span>
                    </div>
                    <div className="col-span-2 text-center">
                        <span className="font-medium text-black text-sm uppercase">Aksi</span>
                    </div>
                </div>

                {/* Body */}
                {announcements.map((item: any) => (
                    <div key={item.id} className="grid grid-cols-12 border-b border-stroke py-4 px-2 hover:bg-gray-50 transition">
                        <div className="col-span-5 md:col-span-6 flex flex-col gap-1 pl-2">
                            <h5 className="font-semibold text-black">{item.title}</h5>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.content}</p>
                            {item.expiresAt && (
                                <span className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                                    <Calendar size={12} />
                                    Berakhir: {new Date(item.expiresAt).toLocaleDateString('id-ID')}
                                </span>
                            )}
                        </div>

                        <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                            <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 border border-gray-200 text-xs font-medium">
                                <TypeIcon type={item.type} />
                                <span className="hidden md:inline">{item.type.replace('_', ' ')}</span>
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-2 flex items-center justify-center">
                            <form action={async () => {
                                "use server"
                                await toggleAnnouncementStatus(item.id, item.isActive)
                            }}>
                                <button
                                    title={item.isActive ? "Matikan" : "Aktifkan"}
                                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium transition ${item.isActive ? 'bg-emerald-500 text-emerald-600 hover:bg-emerald-200' : 'bg-red-500 text-red-600 hover:bg-red-200'}`}
                                >
                                    {item.isActive ? 'Aktif' : 'Nonaktif'}
                                </button>
                            </form>
                        </div>

                        <div className="col-span-2 flex items-center justify-center gap-2">
                            <Link
                                href={`/dashboard/announcements/${item.id}/edit`}
                                className="hover:text-primary transition"
                            >
                                <Pencil size={18} />
                            </Link>
                            <form action={async () => {
                                "use server"
                                await deleteAnnouncement(item.id)
                            }}>
                                <button className="hover:text-red-500 transition">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        Belum ada pengumuman.
                    </div>
                )}
            </div>
        </div>
    )
}
