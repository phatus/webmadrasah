
import AlumniForm from "@/components/dashboard/AlumniForm"
import { getAlumniById } from "@/actions/alumni"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Alumni | Web Madrasah",
}

export default async function EditAlumniPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id)
    if (isNaN(id)) notFound()

    const alumni = await getAlumniById(id)
    if (!alumni) notFound()

    return (
        <div className="mx-auto max-w-270">
            <AlumniForm data={alumni} />
        </div>
    )
}
