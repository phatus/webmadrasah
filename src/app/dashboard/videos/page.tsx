import { getVideos, deleteVideo } from "@/actions/video"
import VideoForm from "@/components/dashboard/VideoForm"
import { Trash2, ExternalLink, Youtube } from "lucide-react"
import Link from "next/link"

interface Video {
    id: number;
    title: string;
    url: string;
    youtubeId: string;
}

export default async function VideosPage() {
    const videos = await getVideos()

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
                    <h4 className="mb-6 text-xl font-semibold text-black">
                        Daftar Video Youtube
                    </h4>

                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {videos.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Belum ada video.</p>
                        ) : (
                            videos.map((video: Video) => (
                                <div key={video.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="relative w-full sm:w-48 aspect-video rounded-md overflow-hidden flex-shrink-0 bg-black">
                                        <img
                                            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                            alt={video.title}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <Youtube className="text-white w-8 h-8 opacity-80" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-semibold text-black mb-1 line-clamp-1">{video.title}</h5>
                                        <Link
                                            href={video.url}
                                            target="_blank"
                                            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 mb-3"
                                        >
                                            {video.url} <ExternalLink size={12} />
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deleteVideo(video.id)
                                        }}>
                                            <button className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded border border-red-100 transition-colors hover:bg-red-100">
                                                <Trash2 size={12} /> Hapus Video
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="xl:col-span-1">
                <div className="rounded-sm border border-stroke bg-white shadow-default">
                    <div className="border-b border-stroke py-4 px-6.5">
                        <h3 className="font-medium text-black">
                            Tambah Video Baru
                        </h3>
                    </div>
                    <VideoForm />
                </div>
            </div>
        </div>
    )
}
