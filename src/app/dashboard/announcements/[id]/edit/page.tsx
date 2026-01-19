
import AnnouncementForm from "@/components/dashboard/AnnouncementForm"
import { getAnnouncement } from "@/actions/announcement"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Pengumuman | Web Madrasah",
}

export default async function EditAnnouncementPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id)
    if (isNaN(id)) notFound()

    const announcement = await getAnnouncement(id)
    if (!announcement) notFound()

    return (
        <div className="mx-auto max-w-270">
            <AnnouncementForm data={announcement} />
        </div>
    )
}
