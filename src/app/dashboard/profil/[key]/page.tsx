
import { getPageContent } from "@/actions/page-content"
import PageEditor from "@/components/dashboard/PageEditor"
import { notFound } from "next/navigation"

interface PageParams {
    params: Promise<{
        key: string
    }>
}

const PAGE_CONFIG: Record<string, { label: string, defaultTitle: string, defaultContent: string }> = {
    'sambutan': {
        label: 'Sambutan Kepala Madrasah',
        defaultTitle: 'Sambutan Kepala Madrasah',
        defaultContent: '<p>Assalamualaikum Warahmatullahi Wabarakatuh...</p>'
    },
    'visi-misi': {
        label: 'Visi & Misi',
        defaultTitle: 'Visi & Misi MTsN 1 Pacitan',
        defaultContent: '<h2>Visi</h2><p>Terwujudnya...</p><h2>Misi</h2><ul><li>...</li></ul>'
    },
    'sejarah': {
        label: 'Sejarah Madrasah',
        defaultTitle: 'Sejarah Singkat',
        defaultContent: '<p>MTsN 1 Pacitan berdiri sejak...</p>'
    }
}

import SambutanEditor from "@/components/dashboard/SambutanEditor"
import VisiMisiEditor from "@/components/dashboard/VisiMisiEditor"

export default async function DashboardProfilePage({ params }: PageParams) {
    const { key } = await params
    // Handle specific key naming if needed, assuming 'sambutan' or 'sambutan-kepala'
    const cleanKey = key === 'sambutan-kepala' ? 'sambutan' : key

    const config = PAGE_CONFIG[cleanKey] || PAGE_CONFIG[key]

    if (!config) {
        notFound()
    }

    const data = await getPageContent(cleanKey)

    if (key === 'sambutan-kepala' || key === 'sambutan') {
        const pageKey = 'sambutan' // Ensure we stick to one consistent key in DB
        return (
            <SambutanEditor
                pageKey={pageKey}
                label={config.label}
                initialTitle={data?.title || config.defaultTitle}
                initialContent={data?.content || config.defaultContent}
                initialMeta={data?.meta || null}
            />
        )
    }

    if (key === 'visi-misi') {
        return (
            <VisiMisiEditor
                pageKey={cleanKey}
                label={config.label}
                initialTitle={data?.title || config.defaultTitle}
                initialContent={data?.content || config.defaultContent}
                initialMeta={data?.meta || null}
            />
        )
    }

    return (
        <PageEditor
            pageKey={cleanKey}
            label={config.label}
            initialTitle={data?.title || config.defaultTitle}
            initialContent={data?.content || config.defaultContent}
        />
    )
}
