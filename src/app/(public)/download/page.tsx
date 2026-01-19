import { getDownloads } from "@/actions/academic"
export const dynamic = 'force-dynamic'
import { FileText, Download as DownloadIcon } from "lucide-react"

export const metadata = {
    title: 'Download Area - MTsN 1 Pacitan',
    description: 'Unduh dokumen resmi, formulir, dan materi akademik MTsN 1 Pacitan.',
}

export default async function DownloadPage() {
    const downloads = await getDownloads()

    // Group by category
    const groupedDownloads = downloads.reduce((acc: any, item: any) => {
        const cat = item.category || 'Lainnya'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
    }, {})

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Download Area</h1>
                    <p className="text-gray-600">Dokumen dan arsip digital madrasah.</p>
                </header>

                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
                    {Object.keys(groupedDownloads).length === 0 ? (
                        <div className="text-center text-gray-500 py-4">Belum ada dokumen tersedia.</div>
                    ) : (
                        Object.entries(groupedDownloads).map(([category, items]: [string, any]) => (
                            <div key={category} className="mb-8 last:mb-0">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{category}</h3>
                                <ul className="space-y-3">
                                    {items.map((item: any) => (
                                        <li key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-gray-700">{item.title}</span>
                                            </div>
                                            <a
                                                href={item.fileUrl}
                                                target="_blank"
                                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                <DownloadIcon className="w-4 h-4" />
                                                <span className="hidden sm:inline">Download</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
