import { getHomeData } from "@/actions/home-editor"
export const dynamic = 'force-dynamic'
import Link from "next/link"
import Image from "next/image"
import { Monitor, BookOpen, Trophy, Globe, FileText, ArrowRight } from "lucide-react"
import { getCachedPosts } from "@/actions/post"
import HomeNewsSection from "@/components/home/HomeNewsSection"
import FeaturedPrograms from "@/components/home/FeaturedPrograms"
import { getPrograms } from "@/actions/featured-program"
import { getAgendas } from "@/actions/academic"
import HomeAgendaSection from "@/components/home/HomeAgendaSection"
import { getVideos } from "@/actions/video"
import HomeVideoSection from "@/components/home/HomeVideoSection"

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
    const heroImage = heroMeta.image || "/images/hero-default.jpg" // You might want a better default or check if file exists

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white">
                {/* Elegant Dot Pattern Background - Increased Contrast */}
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>
                <div className="absolute inset-0 bg-white/40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_0%,#000_100%)] pointer-events-none"></div>

                {/* Gradient Blobs */}
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-green-50/40 to-transparent -z-10"></div>
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-green-100/40 blur-[100px] -z-10"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-50/40 blur-[100px] -z-10"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                        <div className="w-full lg:w-1/2 space-y-6 z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 border border-green-200 text-green-700 text-sm font-medium mb-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Website Resmi Madrasah
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                                {title.includes("MTsN 1 Pacitan") ? (
                                    <>
                                        {title.split("MTsN 1 Pacitan")[0]}
                                        <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                            MTsN 1 Pacitan
                                        </span>
                                        {title.split("MTsN 1 Pacitan")[1]}
                                    </>
                                ) : (
                                    title
                                )}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl lg:mx-0 mx-auto">
                                {content}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                                <Link
                                    href={heroMeta.primaryButtonLink || "/profil"}
                                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-1"
                                >
                                    {heroMeta.primaryButtonText || "Profil Madrasah"}
                                </Link>
                                <Link
                                    href="/berita"
                                    className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    Baca Berita <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="w-full lg:w-1/2 relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                {heroImage && heroImage.startsWith("http") ? (
                                    <Image
                                        src={heroImage}
                                        alt="Hero Image"
                                        fill
                                        className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <p>No Image Selected</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Decorative Blobs */}
                            <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-yellow-400/30 blur-2xl rounded-full"></div>
                            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-green-400/30 blur-2xl rounded-full"></div>
                        </div>
                    </div>
                </div>
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
