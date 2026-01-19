import type { Metadata } from 'next';
import { getPageContent } from '@/actions/page-content';
import parse from 'html-react-parser';
import { Target, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Visi & Misi | MTsN 1 Pacitan',
    description: 'Visi dan Misi Madrasah Tsanawiyah Negeri 1 Pacitan',
};

// Fallback content
const DEFAULT_CONTENT = `
<h2>Visi Madrasah</h2>
<p>"Terwujudnya Generasi Muslim yang Beriman, Bertakwa, Berprestasi, dan Berwawasan Lingkungan"</p>

<h2>Misi Madrasah</h2>
<ul>
<li>Menumbuhkan penghayatan dan pengamalan ajaran agama Islam.</li>
<li>Melaksanakan pembelajaran dan bimbingan secara efektif, kreatif, dan inovatif.</li>
<li>Mendorong dan membantu setiap siswa untuk mengenali potensi dirinya agar dapat dikembangkan secara optimal.</li>
<li>Menumbuhkan semangat keunggulan secara intensif kepada seluruh warga madrasah.</li>
<li>Menerapkan manajemen partisipatif dengan melibatkan seluruh warga madrasah dan komite madrasah.</li>
<li>Menciptakan lingkungan madrasah yang sehat, bersih, dan indah.</li>
</ul>
`;

export default async function VisiMisiPage() {
    const pageData = await getPageContent('visi-misi');
    const content = pageData?.content || DEFAULT_CONTENT;
    const title = pageData?.title || 'Visi & Misi';

    // Parse meta for subtitle
    let subtitle = "Landasan cita-cita dan arah perjuangan MTsN 1 Pacitan dalam mencetak generasi unggul.";
    try {
        if (pageData?.meta) {
            const meta = JSON.parse(pageData.meta);
            if (meta.description) {
                subtitle = meta.description;
            }
        }
    } catch (e) {
        // Fallback to default
    }

    return (
        <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-6">
                        <Target className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
                    <div className="prose prose-lg prose-headings:text-emerald-800 prose-p:text-gray-600 prose-ul:text-gray-600 prose-li:marker:text-emerald-500 max-w-none">
                        {parse(content)}
                    </div>
                </div>
            </div>
        </div>
    );
}
