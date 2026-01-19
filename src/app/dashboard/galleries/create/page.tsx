
import GalleryForm from "@/components/dashboard/GalleryForm"

export const metadata = {
    title: "Buat Album Galeri | Web Madrasah",
}

export default function CreateGalleryPage() {
    return (
        <div className="mx-auto max-w-270">
            <GalleryForm />
        </div>
    )
}
