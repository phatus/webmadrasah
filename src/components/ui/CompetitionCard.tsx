import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Trophy, Users } from 'lucide-react';

interface CompetitionProps {
    id: number;
    title: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    _count?: {
        submissions: number;
    };
}

interface CompetitionCardProps {
    competition: CompetitionProps;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
    const imageUrl = competition.image || '/placeholder-competition.jpg';
    const isEnded = new Date(competition.endDate) < new Date();

    const formattedStartDate = new Date(competition.startDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
    });
    const formattedEndDate = new Date(competition.endDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className={`flex flex-col overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-2xl bg-white border ${isEnded ? 'opacity-75 grayscale-[0.5]' : 'border-emerald-100'}`}>
            <div className="relative h-56 w-full bg-gray-200">
                {competition.image ? (
                    <Image
                        src={competition.image}
                        alt={competition.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                        <Trophy className="h-12 w-12 opacity-20" />
                        <span className="text-sm font-medium">Poster Lomba</span>
                    </div>
                )}

                {competition.isActive && !isEnded && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        Buka Pendaftaran
                    </div>
                )}
                {isEnded && (
                    <div className="absolute top-4 right-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Selesai
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="mr-1.5 h-4 w-4 text-emerald-600" />
                        <span>{formattedStartDate} - {formattedEndDate}</span>
                    </div>

                    <Link href={`/competitions/${competition.slug}`} className="block">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-emerald-600 transition-colors uppercase tracking-tight">
                            {competition.title}
                        </h3>
                    </Link>

                    {competition.description && (
                        <div
                            className="text-sm text-gray-600 line-clamp-3 mb-4 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: competition.description.length > 150 ? competition.description.substring(0, 150) + '...' : competition.description }}
                        />
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Users className="mr-1 h-3.5 w-3.5" />
                        <span>{competition._count?.submissions || 0} Pendaftar</span>
                    </div>

                    <Link
                        href={`/competitions/${competition.slug}`}
                        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-all ${isEnded
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {isEnded ? 'Lihat Detail' : 'Daftar Sekarang'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
