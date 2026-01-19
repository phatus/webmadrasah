
import { getSettings } from "@/actions/settings"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default async function Footer() {
    const settings = await getSettings()

    const siteName = settings['site_name'] || "MTsN 1 Pacitan"
    const description = settings['site_description'] || "Membentuk generasi berprestasi, berakhlak mulia, dan berwawasan lingkungan."
    const address = settings['contact_address'] || "R34X+6XQ, Jl. H. Samanhudi, Palihan, Pucangsewu, Kec. Pacitan, Kabupaten Pacitan, Jawa Timur 63511"
    const phone = settings['contact_phone'] || "(0357) 881303"
    const email = settings['contact_email'] || "info@mtsnpacitan.sch.id"

    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 className="text-2xl font-bold text-emerald-500">{siteName}</h3>
                        <p className="mt-4 text-gray-400">
                            {description}
                        </p>
                        <div className="mt-6 flex gap-4">
                            {settings['social_facebook'] && (
                                <a href={settings['social_facebook']} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                                    <Facebook size={20} />
                                </a>
                            )}
                            {settings['social_instagram'] && (
                                <a href={settings['social_instagram']} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {settings['social_youtube'] && (
                                <a href={settings['social_youtube']} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500">
                                    <Youtube size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold">Kontak</h4>
                        <ul className="mt-4 space-y-3 text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="flex-shrink-0 mt-1" />
                                <span>{address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold">Tautan Cepat</h4>
                        <ul className="mt-4 space-y-2 text-gray-400">
                            <li><a href="/profil/sejarah" className="hover:text-emerald-500">Profil</a></li>
                            <li><a href="/berita" className="hover:text-emerald-500">Berita</a></li>
                            <li><a href="#" className="hover:text-emerald-500">E-Learning</a></li>
                            <li><a href="#" className="hover:text-emerald-500">PPDB</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold">Lokasi</h4>
                        <div className="mt-4 overflow-hidden rounded-lg shadow-sm border border-gray-800">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.465492415175!2d111.08868971077755!3d-8.198308782046467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7961bd40e66f8d%3A0xc682da26850c905b!2sMTs%20Negeri%20Pacitan!5e0!3m2!1sen!2sid!4v1705646199464!5m2!1sen!2sid"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
