
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface Agenda {
    id: number;
    title: string;
    slug: string;
    date: Date;
    location: string | null;
    description: string | null;
}

export default function HomeAgendaSection({ agendas }: { agendas: Agenda[] }) {
    if (agendas.length === 0) return null;

    return (
        <section className="bg-white py-12 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Jadwal Kegiatan</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">Agenda Mendatang</h2>
                    </div>
                    <Link href="/agenda" className="group flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                        Lihat Semua Agenda
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {agendas.map((agenda, index) => {
                        const dateObj = new Date(agenda.date);
                        const day = dateObj.getDate();
                        const month = dateObj.toLocaleDateString('id-ID', { month: 'short' });
                        const year = dateObj.getFullYear();

                        return (
                            <div key={index} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                <div className="p-5 flex gap-4 items-start">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center bg-emerald-50 text-emerald-700 rounded-lg w-14 h-16 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <span className="text-xl font-bold leading-none">{day}</span>
                                        <span className="text-xs font-medium uppercase mt-0.5">{month}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{year}</span>
                                            <span className="mx-1">•</span>
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="truncate">{agenda.location || 'Madrasah'}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                            {agenda.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
