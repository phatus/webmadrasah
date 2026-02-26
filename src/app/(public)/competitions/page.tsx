import { getCompetitions } from '@/actions/competition';
import CompetitionCard from '@/components/ui/CompetitionCard';
import { Trophy } from 'lucide-react';

export default async function CompetitionsPage() {
    const competitions = await getCompetitions();
    const activeCompetitions = competitions.filter((c: any) => c.isActive && new Date(c.endDate) >= new Date());
    const pastCompetitions = competitions.filter((c: any) => !c.isActive || new Date(c.endDate) < new Date());

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-emerald-800 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <Trophy className="mx-auto h-16 w-16 mb-6 text-yellow-400 drop-shadow-lg" />
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight uppercase">Kompetisi & Lomba</h1>
                    <p className="text-xl text-emerald-100/90 font-medium">
                        Tunjukkan bakatmu, raih prestasi, dan jadilah kebanggaan MTsN 1 Pacitan.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-10">
                {activeCompetitions.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1.5 bg-emerald-600 rounded-full"></div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Lomba Terbaru</h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {activeCompetitions.map((comp: any) => (
                                <CompetitionCard key={comp.id} competition={comp} />
                            ))}
                        </div>
                    </section>
                )}

                {pastCompetitions.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8 mt-12">
                            <div className="h-8 w-1.5 bg-gray-400 rounded-full"></div>
                            <h2 className="text-3xl font-bold text-gray-700 tracking-tight opacity-80">Lomba yang Telah Selesai</h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 opacity-90">
                            {pastCompetitions.map((comp: any) => (
                                <CompetitionCard key={comp.id} competition={comp} />
                            ))}
                        </div>
                    </section>
                )}

                {competitions.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-gray-100">
                        <div className="mx-auto h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                            <Trophy className="h-10 w-10 text-emerald-200" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Kompetisi</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Saat ini belum ada lomba yang sedang berlangsung. Nantikan informasi selanjutnya di halaman ini!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
