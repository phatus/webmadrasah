'use client'

import { DiscussionEmbed } from 'disqus-react'

type Props = {
    post: {
        id: number
        slug: string
        title: string
    }
}

export default function DisqusComments({ post }: Props) {
    // Replace with the user's actual Disqus shortname
    const disqusShortname = "webmadrasah-demo"

    const disqusConfig = {
        url: typeof window !== 'undefined' ? window.location.href : '',
        identifier: post.slug,
        title: post.title,
        language: 'id'
    }

    return (
        <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-emerald-500 pl-3">
                Komentar
            </h3>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>
    )
}
