
import ExtracurricularForm from "@/components/dashboard/kesiswaan/ExtracurricularForm"

export const metadata = {
    title: "Tambah Ekstrakurikuler | Web Madrasah",
}

export default function CreateEkstraPage() {
    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Tambah Ekstrakurikuler Baru
                </h2>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <ExtracurricularForm />
            </div>
        </div>
    )
}
