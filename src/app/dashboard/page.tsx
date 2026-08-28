import prisma from "@/lib/db"
import Link from "next/link"
import { FileText, Users, Eye, ArrowUp } from "lucide-react"
import SyncElearningButton from "@/components/dashboard/SyncElearningButton"

export default async function DashboardPage() {
    const postCount = await prisma.post.count()
    const userCount = await prisma.user.count()
    // Placeholder for other stats, in real app fetch from DB
    const teacherCount = await prisma.teacher.count()

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                {/* Card 1: View Stats */}
                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                    <div className="flex h-11.5 w-11.5 h-12 w-12 items-center justify-center rounded-full bg-meta-2 bg-slate-100">
                        <Eye className="fill-primary text-blue-600" size={22} />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black text-2xl">
                                {postCount}
                            </h4>
                            <span className="text-sm font-medium text-slate-600">Total Berita</span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Users */}
                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                    <div className="flex h-11.5 w-11.5 h-12 w-12 items-center justify-center rounded-full bg-meta-2 bg-slate-100">
                        <Users className="fill-primary text-blue-600" size={22} />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black text-2xl">
                                {userCount}
                            </h4>
                            <span className="text-sm font-medium text-slate-600">Total Pengguna</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Teachers */}
                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                    <div className="flex h-11.5 w-11.5 h-12 w-12 items-center justify-center rounded-full bg-meta-2 bg-slate-100">
                        <Users className="fill-primary text-emerald-600" size={22} />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black text-2xl">
                                {teacherCount}
                            </h4>
                            <span className="text-sm font-medium text-slate-600">Guru & Staf</span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Visitors (Example) */}
                <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                    <div className="flex h-11.5 w-11.5 h-12 w-12 items-center justify-center rounded-full bg-meta-2 bg-slate-100">
                        <FileText className="fill-primary text-amber-600" size={22} />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div>
                            <h4 className="text-title-md font-bold text-black text-2xl">
                                12.4K
                            </h4>
                            <span className="text-sm font-medium text-slate-600">Total Views</span>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-emerald-500">
                            0.43%
                            <ArrowUp size={14} />
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Integrasi Webhook E-Learning
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Sinkronkan secara manual data Siswa, Guru, dan Tahun Ajaran dari WebMadrasah ke aplikasi E-Learning via Webhook API.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <SyncElearningButton />
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                {/* Main Dashboard Chart or Content could go here */}
            </div>
        </div>
    )
}
