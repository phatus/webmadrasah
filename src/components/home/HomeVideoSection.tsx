
import Link from 'next/link';
import { Play, Youtube } from 'lucide-react';

interface Video {
    id: number;
    title: string;
    url: string;
    youtubeId: string;
}

export default function HomeVideoSection({ videos }: { videos: Video[] }) {
    // if (videos.length === 0) return null; // Don't hide, show placeholder

    return (
        <section className="bg-white py-16 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
                    <div className="relative">
                        <div className="absolute -left-10 -top-10 w-24 h-24 bg-red-50 rounded-full blur-2xl -z-10"></div>
                        <span className="text-red-600 font-semibold tracking-wide uppercase text-sm flex items-center gap-2">
                            <Youtube size={18} />
                            Galeri Video
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Video Terbaru</h2>
                    </div>
                    <Link
                        href="https://www.youtube.com/@mtsnegeri1pacitan506"
                        target="_blank"
                        className="group flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Youtube size={20} />
                        Kunjungi Channel Youtube
                    </Link>
                </div>

                {videos.length === 0 ? (
                    <div className="w-full py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                        <Youtube size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Belum Ada Video</h3>
                        <p className="text-gray-500 max-w-md">Video yang Anda tambahkan melalui dashboard akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {videos.map((video, index) => (
                            <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                {/* Video Container - Maintain 16:9 Aspect Ratio */}
                                <div className="relative w-full aspect-video bg-black group-hover:scale-105 transition-transform duration-500 origin-center">
                                    {/* Thumbnail Image */}
                                    <img
                                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
                                        <a
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-16 h-16 bg-red-600/90 text-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"
                                        >
                                            <Play size={28} fill="currentColor" className="ml-1" />
                                        </a>
                                    </div>
                                </div>

                                <div className="p-6 relative bg-white">
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                                            {video.title}
                                        </a>
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Youtube size={14} className="text-red-500" />
                                        MTsN 1 Pacitan Channel
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
