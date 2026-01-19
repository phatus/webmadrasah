
import Link from "next/link"
import { getFacilities, deleteFacility } from "@/actions/facility"
import { Plus, Pencil, Trash2, MapPin } from "lucide-react"
import Image from "next/image"

export const metadata = {
    title: "Manajemen Sarana Prasarana | Web Madrasah",
}

export default async function FacilitiesPage() {
    const facilities = await getFacilities()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-xl font-semibold text-black">
                        Sarana & Prasarana
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Kelola daftar fasilitas sekolah
                    </p>
                </div>
                <Link
                    href="/dashboard/sarana-prasarana/create"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 px-10 text-center font-medium text-white hover:bg-blue-700 lg:px-8 xl:px-10"
                >
                    <Plus />
                    Tambah Fasilitas
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                {facilities.map((item: any) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-lg border border-stroke bg-white shadow-card transition hover:shadow-card-2">
                        <div className="relative h-48 w-full bg-gray-200">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500">
                                    <MapPin size={32} />
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <h5 className="mb-2 text-lg font-semibold text-black">
                                {item.name}
                            </h5>
                            <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                                {item.description || "Tidak ada deskripsi"}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-stroke">
                                <span className="text-xs text-gray-500">
                                    Detail
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/sarana-prasarana/${item.id}/edit`}
                                        className="inline-flex items-center justify-center rounded p-2 text-primary hover:bg-gray-100 transition"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                    <form action={async () => {
                                        "use server"
                                        await deleteFacility(item.id)
                                    }}>
                                        <button
                                            className="inline-flex items-center justify-center rounded p-2 text-red-500 hover:bg-red-50 transition"
                                            title="Hapus"
                                            type="submit"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {facilities.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                    Belum ada data fasilitas. Silakan tambah data baru.
                </div>
            )}
        </div>
    )
}
