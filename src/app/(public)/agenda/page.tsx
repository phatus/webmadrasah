import { getAgendas } from "@/actions/academic"
export const dynamic = 'force-dynamic'
import { Calendar, MapPin } from "lucide-react"

export const metadata = {
    title: 'Agenda Kegiatan - MTsN 1 Pacitan',
    description: 'Jadwal kegiatan akademik dan non-akademik di MTsN 1 Pacitan.',
}

export default async function AgendaPage() {
    const agendas = await getAgendas()

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Agenda Kegiatan</h1>
                    <p className="text-gray-600">Jadwal kegiatan mendatang di madrasah.</p>
                </header>

                <div className="grid gap-6">
                    {agendas.map((agenda: any) => {
                        const date = new Date(agenda.date)
                        const day = date.getDate()
                        const month = date.toLocaleDateString('id-ID', { month: 'short' })
                        const year = date.getFullYear()

                        return (
                            <div key={agenda.id} className="bg-white rounded-lg shadow-sm border-l-4 border-l-emerald-500 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                <div className="bg-emerald-50 text-emerald-700 p-6 flex flex-col items-center justify-center min-w-[120px] text-center border-b md:border-b-0 md:border-r border-emerald-100">
                                    <span className="text-4xl font-bold leading-none">{day}</span>
                                    <span className="text-sm uppercase font-semibold mt-1">{month}</span>
                                    <span className="text-xs text-emerald-600 mt-1">{year}</span>
                                </div>
                                <div className="p-6 flex-grow">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">{agenda.title}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        {agenda.location && (
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {agenda.location}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600">{agenda.description}</p>
                                </div>
                            </div>
                        )
                    })}
                    {agendas.length === 0 && (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm">
                            Belum ada agenda kegiatan mendatang.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
