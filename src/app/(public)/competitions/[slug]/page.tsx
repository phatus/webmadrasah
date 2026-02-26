import { getCompetitionBySlug } from '@/actions/competition';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Trophy, ChevronRight, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import CompetitionSubmissionForm from '@/components/forms/CompetitionSubmissionForm';
import Link from 'next/link';

export default async function CompetitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const competition = await getCompetitionBySlug(slug);

    if (!competition) {
        notFound();
    }

    const isEnded = new Date(competition.endDate) < new Date();
    const formattedRange = `${new Date(competition.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} s.d. ${new Date(competition.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <Link href="/" className="hover:text-emerald-600 transition-colors underline-offset-4 hover:underline">Beranda</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/competitions" className="hover:text-emerald-600 transition-colors underline-offset-4 hover:underline">Kompetisi</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-emerald-600 truncate max-w-[200px]">{competition.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid gap-10 lg:grid-cols-3">
                    {/* Left Side: Detail & Rules */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {competition.image && (
                                <div className="relative h-64 md:h-96 w-full">
                                    <Image
                                        src={competition.image}
                                        alt={competition.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            <div className="p-8">
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider border border-emerald-100/50">
                                        <Trophy className="h-3.5 w-3.5" />
                                        Kompetisi
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 text-gray-600 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider border border-gray-200">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formattedRange}
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight uppercase tracking-tight">
                                    {competition.title}
                                </h1>

                                <div className="prose prose-emerald lg:prose-lg max-w-none">
                                    <h3 className="flex items-center gap-3 text-emerald-800 font-bold uppercase tracking-tight border-b-2 border-emerald-100 pb-2 mb-6">
                                        <FileText className="h-6 w-6" />
                                        Ketentuan & Informasi
                                    </h3>
                                    <div
                                        className="text-gray-700 leading-relaxed space-y-4"
                                        dangerouslySetInnerHTML={{ __html: competition.description || 'Tidak ada deskripsi tersedia.' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Info / CTA */}
                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white shadow-xl shadow-emerald-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-emerald-200" />
                                Siap untuk Berkompetisi?
                            </h3>
                            <p className="text-emerald-50 leading-relaxed mb-0">
                                Pastikan karyamu siap sebelum mengisi formulir pendaftaran. Jika ada pertanyaan, hubungi panitia melalui kontak yang tersedia.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {isEnded ? (
                                <div className="bg-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300 text-center grayscale">
                                    <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                                        <Calendar className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Ditutup</h3>
                                    <p className="text-gray-500 font-medium">
                                        Maaf, masa pendaftaran lomba ini telah berakhir pada {new Date(competition.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.
                                    </p>
                                </div>
                            ) : !competition.isActive ? (
                                <div className="bg-yellow-50 rounded-2xl p-8 border-2 border-dashed border-yellow-200 text-center">
                                    <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-yellow-900 mb-2">Pendaftaran Dinonaktifkan</h3>
                                    <p className="text-yellow-700 font-medium">
                                        Mohon maaf, pendaftaran untuk kompetisi ini sedang dinonaktifkan sementara oleh panitia.
                                    </p>
                                </div>
                            ) : (
                                <CompetitionSubmissionForm
                                    competitionId={competition.id}
                                    competitionTitle={competition.title}
                                />
                            )}

                            {/* Help Box */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    Bantuan Pendaftaran
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-3">
                                    <li className="flex gap-2">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>Gunakan link Google Drive yang sudah diset ke 'Anyone with link'.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>YouTube link disarankan untuk kategori vlog.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>Pastikan nomor WhatsApp aktif untuk dihubungi panitia.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
