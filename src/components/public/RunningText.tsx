
import { Megaphone } from "lucide-react"

interface RunningTextProps {
    announcements: {
        id: number
        content: string | null
    }[]
}

export default function RunningText({ announcements }: RunningTextProps) {
    if (!announcements.length) return null

    return (
        <div className="bg-emerald-900 text-white text-sm py-2 relative overflow-hidden flex items-center z-50 shadow-sm border-b border-emerald-800">
            <div className="absolute left-0 top-0 bottom-0 bg-emerald-950 px-3 md:px-4 flex items-center z-10 font-bold tracking-wide shadow-lg skew-x-12 -ml-2">
                <div className="-skew-x-12 flex items-center gap-2">
                    <Megaphone size={16} className="text-yellow-400 animate-pulse" />
                    <span className="hidden sm:inline">PENGUMUMAN</span>
                </div>
            </div>

            <div className="marquee-container w-full overflow-hidden whitespace-nowrap pl-32 md:pl-40">
                <div className="inline-block animate-marquee whitespace-nowrap">
                    {announcements.map((item, index) => (
                        <span key={item.id} className="mx-8 inline-flex items-center">
                            {item.content}
                            {index !== announcements.length - 1 && <span className="ml-8 text-emerald-500">•</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
