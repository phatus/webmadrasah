import NewsCard from '@/components/ui/NewsCard';
import { getPosts } from '@/actions/post';
import Link from 'next/link';

export default async function NewsPage({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const limit = 9;
    const { posts, totalPages } = await getPosts(currentPage, limit);

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Berita & Artikel</h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Kabar terbaru dari kegiatan dan prestasi di MTsN 1 Pacitan.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.length > 0 ? (
                        posts.map((post: any) => (
                            <NewsCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                            Belum ada berita.
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="mt-12 flex justify-center gap-4">
                    <Link
                        href={`/berita?page=${Math.max(1, currentPage - 1)}`}
                        className={`rounded-md bg-white px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        Previous
                    </Link>
                    <span className="flex items-center text-gray-700 font-medium">Page {currentPage}</span>
                    <Link
                        href={`/berita?page=${currentPage + 1}`}
                        className={`rounded-md bg-white px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    );
}
