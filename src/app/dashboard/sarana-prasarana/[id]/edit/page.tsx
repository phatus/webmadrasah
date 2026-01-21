import FacilityForm from "@/components/dashboard/FacilityForm"
import { getFacility } from "@/actions/facility"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Fasilitas | Web Madrasah",
}

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const facility = await getFacility(parseInt(id))

    if (!facility) {
        notFound()
    }

    return (
        <FacilityForm data={facility} />
    )
}
