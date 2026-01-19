
import AnnouncementForm from "@/components/dashboard/AnnouncementForm"

export const metadata = {
    title: "Buat Pengumuman | Web Madrasah",
}

export default function CreateAnnouncementPage() {
    return (
        <div className="mx-auto max-w-270">
            <AnnouncementForm />
        </div>
    )
}
