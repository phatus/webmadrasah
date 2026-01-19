import NewsCard from '@/components/ui/NewsCard';
import Link from 'next/link';

interface HomeNewsSectionProps {
    posts: any[]; // Replace 'any' with imported type if available
}

export default function HomeNewsSection({ posts }: HomeNewsSectionProps) {
    return (
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Berita Terbaru
                    </h2>
                    <Link
                        href="/berita"
                        className="hidden text-sm font-semibold text-emerald-600 hover:text-emerald-500 sm:block"
                    >
                        Lihat semua berita &rarr;
                    </Link>
                </div>

                <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <NewsCard key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-gray-500">Belum ada berita terbaru.</p>
                    )}
                </div>

                <div className="mt-8 sm:hidden">
                    <Link
                        href="/berita"
                        className="block text-sm font-semibold text-emerald-600 hover:text-emerald-500"
                    >
                        Lihat semua berita &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
}
