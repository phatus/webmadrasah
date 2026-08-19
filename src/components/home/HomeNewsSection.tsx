import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import NewsCard from '@/components/ui/NewsCard';

interface HomeNewsSectionProps {
    posts: any[];
}

export default function HomeNewsSection({ posts }: HomeNewsSectionProps) {
    if (!posts || posts.length === 0) {
        return (
            <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-slate-500">
                    Belum ada berita terbaru.
                </div>
            </section>
        );
    }

    const headlinePost = posts[0];
    const previousPosts = posts.slice(1);

    const formattedHeadlineDate = new Date(headlinePost.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <section className="bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Kabar & Informasi
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Berita Terbaru
                        </h2>
                    </div>
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group"
                    >
                        Lihat Semua Berita
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* FULL-WIDTH HEADLINE POST */}
                <div className="mb-12">
                    <Link href={`/berita/${headlinePost.slug}`} className="group block">
                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/20 border border-slate-800 grid grid-cols-1 lg:grid-cols-12">
                            {/* Headline Image Container */}
                            <div className="relative h-64 sm:h-80 lg:h-auto lg:col-span-7 overflow-hidden bg-slate-800 min-h-[300px] lg:min-h-[380px]">
                                {headlinePost.image ? (
                                    <Image
                                        src={headlinePost.image}
                                        alt={headlinePost.title}
                                        fill
                                        priority
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 1024px) 100vw, 60vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500 bg-slate-800 font-medium">
                                        No Image Available
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                        HEADLINE UTAMA
                                    </span>
                                </div>
                            </div>

                            {/* Headline Content Side */}
                            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white">
                                <div>
                                    {/* Meta info */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-400 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formattedHeadlineDate}</span>
                                        </div>
                                        {headlinePost.author?.name && (
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <User className="w-4 h-4 text-emerald-400" />
                                                <span>{headlinePost.author.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-tight mb-4 line-clamp-3">
                                        {headlinePost.title}
                                    </h3>

                                    {/* Excerpt */}
                                    {headlinePost.excerpt && (
                                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                                            {headlinePost.excerpt}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                        Baca Artikel Lengkap
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* PREVIOUS POSTS GRID */}
                {previousPosts.length > 0 && (
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span>Berita Lainnya</span>
                        </h4>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {previousPosts.map((post: any) => (
                                <NewsCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
