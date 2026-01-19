
import Link from "next/link"
import { getAlumni, deleteAlumni, toggleAlumniVerification } from "@/actions/alumni"
import { Plus, Pencil, Trash2, CheckCircle, XCircle, User } from "lucide-react"
import Image from "next/image"

export const metadata = {
    title: "Data Alumni | Web Madrasah",
}

export default async function AlumniPage() {
    const alumniList = await getAlumni()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-xl font-semibold text-black">
                        Data Alumni
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Kelola data alumni yang terdaftar
                    </p>
                </div>
                <Link
                    href="/dashboard/alumni/create"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-4 px-10 text-center font-medium text-white hover:bg-blue-700 lg:px-8 xl:px-10"
                >
                    <Plus />
                    Tambah Alumni
                </Link>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-12 rounded-t-md bg-gray-100 p-4 border-b border-stroke">
                    <div className="col-span-5 md:col-span-4 pl-2">
                        <span className="font-medium text-black text-sm uppercase">Nama & Kontak</span>
                    </div>
                    <div className="col-span-4 md:col-span-4 text-center">
                        <span className="font-medium text-black text-sm uppercase">Status & Institusi</span>
                    </div>
                    <div className="col-span-3 md:col-span-2 text-center">
                        <span className="font-medium text-black text-sm uppercase">Verifikasi</span>
                    </div>
                    <div className="col-span-2 text-center hidden md:block">
                        <span className="font-medium text-black text-sm uppercase">Aksi</span>
                    </div>
                </div>

                {alumniList.map((item: any) => (
                    <div key={item.id} className="grid grid-cols-12 border-b border-stroke py-4 px-2 hover:bg-gray-50 transition items-center">
                        <div className="col-span-5 md:col-span-4 flex items-center gap-3 pl-2">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <User size={20} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h5 className="font-semibold text-black text-sm">{item.name}</h5>
                                <p className="text-xs text-gray-500">Lulus: {item.graduationYear}</p>
                            </div>
                        </div>

                        <div className="col-span-4 md:col-span-4 text-center text-sm text-gray-700">
                            <span className="block font-medium">{item.currentStatus}</span>
                            <span className="block text-xs text-gray-500">{item.institution}</span>
                        </div>

                        <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                            <form action={async () => {
                                "use server"
                                await toggleAlumniVerification(item.id, item.isVerified)
                            }}>
                                <button
                                    title={item.isVerified ? "Batalkan Verifikasi" : "Verifikasi"}
                                    className={`inline-flex items-center gap-1.5 rounded-full bg-opacity-10 py-1 px-3 text-xs font-medium transition ${item.isVerified ? 'bg-emerald-500 text-emerald-600 hover:bg-emerald-200' : 'bg-red-500 text-red-600 hover:bg-red-200'}`}
                                >
                                    {item.isVerified ? (
                                        <><CheckCircle size={14} /> Terverifikasi</>
                                    ) : (
                                        <><XCircle size={14} /> Pending</>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="col-span-12 md:col-span-2 flex items-center justify-center gap-2 mt-2 md:mt-0">
                            <Link
                                href={`/dashboard/alumni/${item.id}/edit`}
                                className="hover:text-primary transition p-2"
                            >
                                <Pencil size={18} />
                            </Link>
                            <form action={async () => {
                                "use server"
                                await deleteAlumni(item.id)
                            }}>
                                <button className="hover:text-red-500 transition p-2">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {alumniList.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        Belum ada data alumni.
                    </div>
                )}
            </div>
        </div>
    )
}
