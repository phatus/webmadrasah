import AnnouncementForm from "@/components/dashboard/AnnouncementForm"
import { getAnnouncement } from "@/actions/announcement"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Pengumuman | Web Madrasah",
}

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const announcement = await getAnnouncement(parseInt(id))

    if (!announcement) {
        notFound()
    }

    return (
        <AnnouncementForm data={announcement} />
    )
}
