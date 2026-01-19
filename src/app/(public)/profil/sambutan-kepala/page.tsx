import { getPageContent } from "@/actions/page-content"
import Image from "next/image"
import parse from "html-react-parser"
import { Quote } from "lucide-react"

export const revalidate = 60

export default async function SambutanKepalaPage() {
    const data = await getPageContent('sambutan')

    // Parse meta data safely
    const meta = data?.meta ? JSON.parse(data.meta) : {
        headmasterName: "Kepala Madrasah",
        headmasterPosition: "Kepala MTsN 1 Pacitan",
        headmasterQuote: "Pendidikan adalah tiket ke masa depan.",
        headmasterImage: ""
    }

    // Default static fallback for title/content if no data
    const title = data?.title || "Sambutan Kepala Madrasah"
    const content = data?.content || "<p>Sambutan belum diisi.</p>"

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row border border-gray-100">

                {/* Left Column - Green Profile Section */}
                <div className="w-full md:w-[400px] bg-[#004d3d] p-8 flex flex-col items-center text-center relative shrink-0">
                    <div className="relative w-64 h-80 bg-gray-200 rounded-md overflow-hidden mb-6 border-4 border-white/20 shadow-lg">
                        {meta.headmasterImage ? (
                            <Image
                                src={meta.headmasterImage}
                                alt={meta.headmasterName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                <span className="text-sm">No Image</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">{meta.headmasterName}</h2>
                    <p className="text-[#4ade80] font-medium mb-8">{meta.headmasterPosition}</p>

                    {meta.headmasterQuote && (
                        <div className="mt-auto relative w-full pt-6 border-t border-white/10">
                            <p className="text-white/90 text-sm italic font-light leading-relaxed">
                                "{meta.headmasterQuote}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Content Section */}
                <div className="flex-1 p-8 md:p-12 bg-white">
                    <div className="flex items-start gap-4 mb-6">
                        <Quote className="h-12 w-12 text-[#4ade80]/30 shrink-0 -mt-2" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#004d3d] mb-2">
                                {title}
                            </h1>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-headings:text-[#004d3d] prose-p:text-gray-600 prose-a:text-emerald-600 max-w-none text-justify">
                        {parse(content)}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <p className="text-[#004d3d] font-bold">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
