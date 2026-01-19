
import { getPrograms } from "@/actions/featured-program"
import ProgramList from "@/components/dashboard/kesiswaan/ProgramList"

export const metadata = {
    title: "Program Unggulan | Web Madrasah",
}

export default async function ProgramPage() {
    const programs = await getPrograms()

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Manajemen Program Unggulan
                </h2>
            </div>

            <ProgramList programs={programs} />
        </div>
    )
}
