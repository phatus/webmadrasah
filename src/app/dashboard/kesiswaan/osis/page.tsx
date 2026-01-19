
import PageEditor from "@/components/dashboard/PageEditor"
import { getPageContent } from "@/actions/page-content"

export const metadata = {
    title: "Manajemen OSIS | Web Madrasah",
}

export default async function OsisPage() {
    const initialData = await getPageContent("kesiswaan_osis")

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Edit Halaman OSIS & MPK
                </h2>
            </div>

            <PageEditor
                pageKey="kesiswaan_osis"
                label="OSIS & MPK"
                initialContent={initialData?.content || ""}
                initialTitle={initialData?.title || "Organisasi Siswa Intra Sekolah (OSIS)"}
            />
        </div>
    )
}
