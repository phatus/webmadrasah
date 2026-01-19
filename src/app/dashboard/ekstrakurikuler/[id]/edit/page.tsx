
import ExtracurricularForm from "@/components/dashboard/kesiswaan/ExtracurricularForm"
import { getExtracurricularById } from "@/actions/extracurricular"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Ekstrakurikuler | Web Madrasah",
}

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function EditEkstraPage({ params }: Props) {
    const { id } = await params
    const { extracurricular, error } = await getExtracurricularById(parseInt(id))

    if (error || !extracurricular) {
        notFound()
    }

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Edit Data Ekstrakurikuler
                </h2>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <ExtracurricularForm initialData={extracurricular} isEdit={true} />
            </div>
        </div>
    )
}
