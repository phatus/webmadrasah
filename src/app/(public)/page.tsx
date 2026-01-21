import { getHomeData } from "@/actions/home-editor"
import Link from "next/link"
import { Monitor, BookOpen, Trophy, Globe, FileText, ArrowRight } from "lucide-react"
import { getCachedPosts } from "@/actions/post"
import HomeNewsSection from "@/components/home/HomeNewsSection"
import FeaturedPrograms from "@/components/home/FeaturedPrograms"
import { getPrograms } from "@/actions/featured-program"
import { getAgendas } from "@/actions/academic"
import HomeAgendaSection from "@/components/home/HomeAgendaSection"
import { getVideos } from "@/actions/video"
import HomeVideoSection from "@/components/home/HomeVideoSection"
import HeroSlider from "@/components/home/HeroSlider"

// Map icon names to components
const iconMap: any = {
    Monitor,
    BookOpen,
    Trophy,
    Globe,
    FileText
}

export default async function Home() {
    const [heroData, cardsData, { posts }, programs, agendas, videos] = await Promise.all([
        getHomeData("home_hero"),
        getHomeData("home_cards"),
        getCachedPosts(1, 3),
        getPrograms(),
        getAgendas(4),
        getVideos(3)
    ])

    // Parse Meta Data
    let heroMeta: any = {}
    if (heroData?.meta) {
        try { heroMeta = JSON.parse(heroData.meta) } catch (e) { }
    }

    let cardsList: any[] = []
    if (cardsData?.meta) {
        try { cardsList = JSON.parse(cardsData.meta) } catch (e) { }
    }

    // Default Fallbacks if no data exists yet
    const title = heroData?.title || "Selamat Datang di MTsN 1 Pacitan"
    const content = heroData?.content || "Madrasah Hebat Bermartabat. Membentuk generasi islami, cerdas, dan berakhlaqul karimah."

    // Handle legacy 'image' and new 'images' array
    const heroImages = Array.isArray(heroMeta.images)
        ? heroMeta.images
        : (heroMeta.image ? [heroMeta.image] : ["/images/hero-default.jpg"])

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section - Redesigned to be Full Width with Slider */}
            <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-center bg-gray-900">
                <HeroSlider
                    images={heroImages}
                    title={title}
                    content={content}
                    primaryButtonText={heroMeta.primaryButtonText}
                    primaryButtonLink={heroMeta.primaryButtonLink}
                />
            </section>

            {/* Featured Programs Section */}
            <FeaturedPrograms programs={programs} />

            {/* Agenda Section */}
            <HomeAgendaSection agendas={agendas} />

            {/* Video Section */}
            <HomeVideoSection videos={videos} />

            {/* Feature Cards Section */}
            <section className="py-20 bg-white relative">
                {/* Soft background for cards section */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent -z-10"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {cardsList.length > 0 ? (
                            cardsList.map((card, index) => {
                                const Icon = iconMap[card.icon] || Monitor
                                // Rotate colors for variety
                                const colorClass = ['bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600', 'bg-green-50 text-green-600'][index % 3]
                                const borderClass = ['border-t-blue-500', 'border-t-orange-500', 'border-t-green-500'][index % 3]

                                return (
                                    <div key={index} className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 border-t-4 ${borderClass} group hover:-translate-y-1`}>
                                        <div className={`h-14 w-14 ${colorClass} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors">{card.title}</h3>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {card.description}
                                        </p>
                                        <Link href={card.link || "#"} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors">
                                            Akses Sekarang <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                )
                            })
                        ) : (
                            // Fallback
                            <>
                                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">Loading...</div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <HomeNewsSection posts={posts} />
        </main>
    )
}
