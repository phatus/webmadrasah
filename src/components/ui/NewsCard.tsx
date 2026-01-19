import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface PostProps {
    title: string;
    slug: string;
    excerpt?: string | null;
    image?: string | null;
    createdAt: Date;
}

interface NewsCardProps {
    post: PostProps;
}

export default function NewsCard({ post }: NewsCardProps) {
    const imageUrl = post.image || '/placeholder.jpg';
    const formattedDate = new Date(post.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl bg-white">
            <div className="relative h-48 w-full bg-gray-200">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}

            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex-1">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        <time dateTime={new Date(post.createdAt).toISOString()}>{formattedDate}</time>
                    </div>
                    <Link href={`/berita/${post.slug}`} className="mt-2 block">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="mt-3 text-base text-gray-500 line-clamp-3">
                            {post.excerpt}
                        </p>
                    </Link>
                </div>
                <div className="mt-6 flex items-center">
                    <div className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        <Link href={`/berita/${post.slug}`}>
                            Baca Selengkapnya &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
