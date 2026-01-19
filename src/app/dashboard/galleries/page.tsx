import Link from "next/link"
import { getGalleries, deleteGallery } from "@/actions/academic"
import { Image as ImageIcon } from "lucide-react"

export default async function GalleriesPage() {
    const galleries = await getGalleries()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-black">
                    Galeri Foto
                </h4>
                <Link
                    href="/dashboard/galleries/create"
                    className="inline-flex items-center gap-2 rounded bg-emerald-600 py-2 px-4 font-medium text-white hover:bg-emerald-700 transition"
                >
                    + Buat Album
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                {galleries.map((item: any) => (
                    <div key={item.id} className="rounded-sm border border-stroke bg-white shadow-default overflow-hidden group">
                        <div className="aspect-video relative overflow-hidden bg-gray-200">
                            {/* Use straight img for now for simplicity in dash */}
                            <img
                                src={item.cover || "https://placehold.co/600x400?text=No+Cover"}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-medium flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5" />
                                    {JSON.parse(item.images).length} Foto
                                </span>
                            </div>
                        </div>
                        <div className="p-4 border-t border-stroke">
                            <h3 className="font-semibold text-black text-lg mb-1">{item.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                            <form action={async () => {
                                "use server"
                                await deleteGallery(item.id)
                            }}>
                                <Link
                                    href={`/dashboard/galleries/${item.id}/edit`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 mb-3"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                    </svg>
                                    Edit Album
                                </Link>
                                <button className="text-red-500 hover:text-red-700 text-sm font-medium w-full text-left flex items-center gap-2">
                                    <svg className="fill-current w-4 h-4" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.7531 2.47502H11.5875V1.9969C11.5875 1.15315 10.9125 0.478149 10.0688 0.478149H7.90312C7.05938 0.478149 6.38438 1.15315 6.38438 1.9969V2.47502H4.21875C3.7125 2.47502 3.29062 2.8969 3.29062 3.40315V4.33127C3.29062 4.83752 3.7125 5.2594 4.21875 5.2594H13.7531C14.2594 5.2594 14.6812 4.83752 14.6812 4.33127V3.40315C14.6812 2.8969 14.2594 2.47502 13.7531 2.47502ZM7.67812 1.9969C7.67812 1.85627 7.79062 1.74377 7.93125 1.74377H10.0406C10.1812 1.74377 10.2937 1.85627 10.2937 1.9969V2.47502H7.67812V1.9969Z" fill="" />
                                        <path d="M14.2312 6.35625H3.74062C3.2625 6.35625 2.925 6.80625 3.00937 7.28438L4.05 16.3406C4.13437 17.0719 4.75312 17.6344 5.48437 17.6344H12.4875C13.2187 17.6344 13.8375 17.0719 13.9219 16.3406L14.9625 7.28438C15.0469 6.80625 14.7094 6.35625 14.2312 6.35625ZM7.67813 14.625C7.67813 15.0187 7.34062 15.3562 6.94688 15.3562C6.55312 15.3562 6.21562 15.0187 6.21562 14.625V9.42187C6.21562 9.02812 6.55312 8.69062 6.94688 8.69062C7.34062 8.69062 7.67813 9.02812 7.67813 9.42187V14.625ZM11.7281 14.625C11.7281 15.0187 11.3906 15.3562 10.9969 15.3562C10.6031 15.3562 10.2656 15.0187 10.2656 14.625V9.42187C10.2656 9.02812 10.6031 8.69062 10.9969 8.69062C11.3906 8.69062 11.7281 9.02812 11.7281 9.42187V14.625Z" fill="" />
                                    </svg>
                                    Hapus Album
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
            {galleries.length === 0 && (
                <div className="text-center text-slate-500 py-10">Belum ada album foto.</div>
            )}
        </div>
    )
}
