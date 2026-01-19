
import AlumniForm from "@/components/dashboard/AlumniForm"

export const metadata = {
    title: "Tambah Alumni | Web Madrasah",
}

export default function CreateAlumniPage() {
    return (
        <div className="mx-auto max-w-270">
            <AlumniForm />
        </div>
    )
}
