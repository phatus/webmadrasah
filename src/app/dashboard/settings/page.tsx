
import SettingsForm from "@/components/dashboard/SettingsForm"
import { getSettings } from "@/actions/settings"

export const metadata = {
    title: "Pengaturan Website | Web Madrasah",
}

export default async function SettingsPage() {
    const settings = await getSettings()

    return (
        <div className="mx-auto max-w-270">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-xl font-semibold text-black">
                        Pengaturan Website
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Sesuaikan identitas sekolah, kontak, dan sosial media.
                    </p>
                </div>
            </div>

            <SettingsForm settings={settings} />
        </div>
    )
}
