
import FacilityForm from "@/components/dashboard/FacilityForm"

export const metadata = {
    title: "Tambah Fasilitas | Web Madrasah",
}

export default function CreateFacilityPage() {
    return (
        <div className="mx-auto max-w-270">
            <FacilityForm />
        </div>
    )
}
