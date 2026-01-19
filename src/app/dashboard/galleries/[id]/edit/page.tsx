
import GalleryForm from "@/components/dashboard/GalleryForm"
import { getGallery } from "@/actions/academic"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Album Galeri | Web Madrasah",
}

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id)
    if (isNaN(id)) notFound()

    const gallery = await getGallery(id)
    if (!gallery) notFound()

    return (
        <div className="mx-auto max-w-270">
            <GalleryForm data={gallery} />
        </div>
    )
}
