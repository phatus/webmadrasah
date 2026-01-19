import type { Metadata } from 'next';
import { Building2, History } from 'lucide-react';
import { getPageContent } from '@/actions/page-content';
import parse from 'html-react-parser';

export const metadata: Metadata = {
    title: 'Sejarah | MTsN 1 Pacitan',
    description: 'Sejarah singkat perjalanan MTsN 1 Pacitan',
};

const DEFAULT_CONTENT = `
<p>MTsN 1 Pacitan memiliki sejarah panjang yang diawali dari semangat masyarakat untuk memiliki lembaga pendidikan Islam yang berkualitas. Berdiri sejak tahun 19XX, madrasah ini awalnya bernama PGA (Pendidikan Guru Agama) sebelum akhirnya bertransformasi menjadi Madrasah Tsanawiyah Negeri.</p>
<p>Seiring berjalannya waktu, MTsN 1 Pacitan terus berbenah baik dari segi sarana prasarana maupun kualitas pendidikan. Berbagai prestasi telah ditorehkan oleh siswa-siswi maupun tenaga pendidik, menjadikan madrasah ini sebagai salah satu rujukan pendidikan di Kabupaten Pacitan.</p>

<h3>Tonggak Sejarah</h3>
<ul>
<li><strong>19XX - Pendirian Awal:</strong> Berdiri dengan nama PGA (Pendidikan Guru Agama).</li>
<li><strong>199X - Penegerian:</strong> Resmi berubah status menjadi Madrasah Tsanawiyah Negeri.</li>
<li><strong>202X - Madrasah Digital:</strong> Transformasi menuju madrasah berbasis digital dan riset.</li>
</ul>
`;

export default async function SejarahPage() {
    const pageData = await getPageContent('sejarah');
    const content = pageData?.content || DEFAULT_CONTENT;

    return (
        <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-6">
                        <History className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Sejarah Singkat</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Menelusuri jejak langkah perjuangan dan perkembangan MTsN 1 Pacitan.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Hero Image / Illustration Placeholder */}
                    <div className="h-64 bg-slate-100 relative w-full flex items-center justify-center border-b border-gray-100">
                        <div className="text-center">
                            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                            <span className="text-slate-400 font-medium">Arsip Dokumentasi Madrasah</span>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg prose-headings:text-emerald-800 prose-p:text-gray-600 prose-ul:text-gray-600 prose-strong:text-emerald-700 max-w-none text-justify">
                            {parse(content)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
