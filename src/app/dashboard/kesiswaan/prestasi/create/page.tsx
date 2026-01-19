
import AchievementForm from "@/components/dashboard/kesiswaan/AchievementForm"

export const metadata = {
    title: "Tambah Prestasi | Web Madrasah",
}

export default function CreatePrestasiPage() {
    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Tambah Prestasi Baru
                </h2>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <AchievementForm />
            </div>
        </div>
    )
}
