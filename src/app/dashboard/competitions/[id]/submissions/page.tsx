import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { updateSubmissionStatus } from "@/actions/competition"
import Link from "next/link"

export default async function CompetitionSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const competition = await prisma.competition.findUnique({
        where: { id: Number(id) },
        include: {
            submissions: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!competition) {
        notFound()
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-xl font-semibold text-black">
                        Peserta Lomba: {competition.title}
                    </h4>
                    <Link href="/dashboard/competitions" className="text-sm text-emerald-600 hover:underline">
                        &larr; Kembali ke Daftar Lomba
                    </Link>
                </div>
                <div className="text-right">
                    <p className="text-black font-medium">{competition.submissions.length} Pendaftar</p>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-6 rounded-sm bg-gray-100 p-2.5">
                    <div className="p-2.5 xl:p-5 col-span-2">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Nama & Sekolah
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Kontak
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Hasil Karya
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Status
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Aksi
                        </h5>
                    </div>
                </div>

                {competition.submissions.map((sub: any, key: number) => (
                    <div
                        className={`grid grid-cols-6 ${key === competition.submissions.length - 1
                            ? ""
                            : "border-b border-stroke border-gray-100"
                            }`}
                        key={sub.id}
                    >
                        <div className="flex items-center p-2.5 xl:p-5 col-span-2">
                            <div>
                                <p className="text-black font-medium">{sub.fullName}</p>
                                <p className="text-xs text-gray-500">{sub.school || 'Tidak ada sekolah'}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <div className="text-center">
                                <p className="text-sm text-black">{sub.email}</p>
                                <p className="text-xs text-gray-500">{sub.phone || '-'}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <a
                                href={sub.workUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded bg-blue-100 py-1 px-3 text-xs font-medium text-blue-700 hover:bg-blue-200 transition"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                Lihat Karya
                            </a>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                    sub.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {sub.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5 gap-2">
                            <form action={async () => {
                                "use server"
                                await updateSubmissionStatus(sub.id, "VERIFIED")
                            }}>
                                <button className="p-1 hover:text-green-600 transition-colors" title="Verifikasi">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </button>
                            </form>
                            <form action={async () => {
                                "use server"
                                await updateSubmissionStatus(sub.id, "REJECTED")
                            }}>
                                <button className="p-1 hover:text-red-600 transition-colors" title="Tolak">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {competition.submissions.length === 0 && (
                    <div className="p-5 text-center text-gray-500">
                        Belum ada pendaftar untuk lomba ini.
                    </div>
                )}
            </div>
        </div>
    )
}
