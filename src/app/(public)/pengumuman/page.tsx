
import { getAnnouncements } from "@/actions/announcement"
import Link from "next/link"
export const dynamic = 'force-dynamic'
import { Calendar, AlertCircle, Info, Monitor, Tag } from "lucide-react"

export const metadata = {
    title: "Pengumuman | MTsN 1 Pacitan",
    description: "Informasi dan pengumuman terbaru dari MTsN 1 Pacitan.",
}

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements()

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'RUNNING_TEXT': return <Monitor size={18} className="text-blue-500" />
            case 'POPUP': return <AlertCircle size={18} className="text-purple-500" />
            default: return <Info size={18} className="text-emerald-500" />
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'RUNNING_TEXT': return "Running Text (Info Berjalan)"
            case 'POPUP': return "Popup (Info Penting)"
            default: return "Informasi Umum"
        }
    }

    // Filter out announcements that are just configuration (like pure runnning text if needed, but for now show all)
    // Actually, usually users only want to see "Info" types in the list, but let's show all for transparency or filter if requested.
    // Let's show all but styled differently.

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Papan Pengumuman</h1>
                    <p className="text-gray-600">
                        Informasi terbaru seputar kegiatan dan akademik madrasah.
                    </p>
                </div>

                <div className="space-y-6">
                    {announcements.map((item: any) => (
                        <div key={item.id} className={`bg-white rounded-lg shadow-sm border p-6 transition hover:shadow-md ${!item.isActive ? 'opacity-60 grayscale' : ''}`}>
                            <div className="flex flex-col md:flex-row gap-4 md:items-start">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        {getTypeIcon(item.type)}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            <Tag size={12} />
                                            {getTypeLabel(item.type)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            <Calendar size={12} />
                                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </span>
                                        {!item.isActive && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600">
                                                Non-Aktif / Kadaluarsa
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>
                                    {item.content && (
                                        <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                                            {item.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {announcements.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                            <p className="text-gray-500">Belum ada pengumuman saat ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
