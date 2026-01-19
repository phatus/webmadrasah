
import { getGallery } from "@/actions/academic"
import { notFound } from "next/navigation"
import GalleryViewer from "@/components/public/GalleryViewer"

interface PageParams {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: PageParams) {
    const { id } = await params
    const gallery = await getGallery(parseInt(id))

    if (!gallery) {
        return {
            title: 'Album Tidak Ditemukan',
        }
    }

    return {
        title: `${gallery.title} | Galeri MTsN 1 Pacitan`,
        description: gallery.description?.slice(0, 160),
    }
}

export default async function GalleryDetailPage({ params }: PageParams) {
    const { id } = await params
    // Ensure id is parsed safely, though 'parseInt' handles strings well, checking for NaN is good practice elsewhere but safe here given 'getGallery' handling
    const gallery = await getGallery(parseInt(id))

    if (!gallery) {
        notFound()
    }

    return <GalleryViewer gallery={gallery} />
}
