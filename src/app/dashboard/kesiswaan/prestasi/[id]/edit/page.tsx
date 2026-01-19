
import AchievementForm from "@/components/dashboard/kesiswaan/AchievementForm"
import { getAchievementById } from "@/actions/achievement"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Prestasi | Web Madrasah",
}

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function EditPrestasiPage({ params }: Props) {
    const { id } = await params
    const { achievement, error } = await getAchievementById(parseInt(id))

    if (error || !achievement) {
        notFound()
    }

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Edit Data Prestasi
                </h2>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <AchievementForm initialData={achievement} isEdit={true} />
            </div>
        </div>
    )
}
