'use client'

import { Facebook, Twitter, MessageCircle, Link as LinkIcon } from "lucide-react"

type Props = {
    url: string
    title: string
}

export default function ShareButtons({ url, title }: Props) {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 py-6 border-t border-b border-gray-100 my-8">
            <span className="font-semibold text-gray-700">Bagikan Berita:</span>
            <div className="flex gap-2">
                <a
                    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                    title="Share to WhatsApp"
                >
                    <MessageCircle className="w-5 h-5" />
                </a>
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                    title="Share to Facebook"
                >
                    <Facebook className="w-5 h-5" />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-gray-800 text-white p-2 rounded-full transition-colors"
                    title="Share to Twitter"
                >
                    <Twitter className="w-5 h-5" />
                </a>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(url)
                        alert('Link tersalin!')
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition-colors"
                    title="Copy Link"
                >
                    <LinkIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
