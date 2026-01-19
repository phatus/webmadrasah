
import FacilityForm from "@/components/dashboard/FacilityForm"
import { getFacility } from "@/actions/facility"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Fasilitas | Web Madrasah",
}

export default async function EditFacilityPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id)
    if (isNaN(id)) notFound()

    const facility = await getFacility(id)
    if (!facility) notFound()

    return (
        <div className="mx-auto max-w-270">
            <FacilityForm data={facility} />
        </div>
    )
}
