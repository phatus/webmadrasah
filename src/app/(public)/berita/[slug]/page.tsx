import { getPost } from "@/actions/post"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import parse from 'html-react-parser'
import ShareButtons from "@/components/ui/ShareButtons"
import DisqusComments from "@/components/ui/DisqusComments"

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        return {
            title: 'Berita Tidak Ditemukan',
        }
    }

    const title = post.metaTitle || post.title
    const description = post.metaDescription || post.excerpt || post.content.substring(0, 160)
    const image = post.ogImage || post.image

    return {
        title: `${title} - MTsN 1 Pacitan`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: image ? [{ url: image }] : [],
        }
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    const formattedDate = new Date(post.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-10">
            <article className="container mx-auto px-4 max-w-4xl">
                <Link href="/berita" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Berita
                </Link>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6 md:p-10">
                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm md:text-base border-b border-gray-100 pb-8">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-emerald-500" />
                                    <time>{formattedDate}</time>
                                </div>
                                <div className="flex items-center">
                                    <User className="w-5 h-5 mr-2 text-emerald-500" />
                                    <span>{post.author.name}</span>
                                </div>
                            </div>
                        </header>

                        {/* Featured Image */}
                        {post.image && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-10 shadow-md">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 900px"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg prose-emerald max-w-none prose-img:rounded-xl">
                            {parse(post.content)}
                        </div>

                        {/* Share Buttons */}
                        <ShareButtons url={`https://mtsn1pacitan.sch.id/berita/${slug}`} title={post.title} />

                        {/* Author Profile */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-start gap-4 mt-8">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                                {post.author.image ? (
                                    <Image
                                        src={post.author.image}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-slate-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Ditulis oleh {post.author.name}</h3>
                                <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                                    {post.author.bio || "Penulis aktif di Web Madrasah MTsN 1 Pacitan."}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Comments */}
                <DisqusComments post={post} />
            </article>
        </div>
    )
}
