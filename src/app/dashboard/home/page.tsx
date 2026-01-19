
import HeroEditor from "@/components/dashboard/home/HeroEditor"
import CardsEditor from "@/components/dashboard/home/CardsEditor"
import { getHomeData } from "@/actions/home-editor"

export const metadata = {
    title: "Manajemen Halaman Depan | Web Madrasah",
    description: "Edit konten halaman depan website",
}

export default async function HomeEditorPage() {
    const heroData = await getHomeData("home_hero")
    const cardsData = await getHomeData("home_cards")

    return (
        <div className="mx-auto max-w-270">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                    Manajemen Halaman Depan
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Hero Editor Section */}
                <HeroEditor initialData={heroData} />

                {/* Cards Editor Section */}
                <CardsEditor initialData={cardsData} />
            </div>
        </div>
    )
}
