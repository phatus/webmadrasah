import ContactForm from "@/components/public/ContactForm"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { getSettings } from "@/actions/settings"

export const metadata = {
    title: "Hubungi Kami | MTsN 1 Pacitan",
    description: "Hubungi kami untuk informasi lebih lanjut mengenai MTsN 1 Pacitan.",
}

export default async function ContactPage() {
    const settings = await getSettings()
    
    const address = settings['contact_address'] || "Jl. H. Samanhudi No. 15, Kelurahan Pacitan, Kecamatan Pacitan, Kabupaten Pacitan, Jawa Timur 63511"
    const phone = settings['contact_phone'] || "(0357) 881061 / 0813-3070-7048"
    const email = settings['contact_email'] || "info@mtsn1pacitan.sch.id"
    const mapEmbed = settings['map_embed'] || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.355152562477!2d111.0965383147775!3d-8.19757659409895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7961b7b7a60b09%3A0xe5f9b8b8b8b8b8b8!2sMTsN%20Pacitan!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid"

    // Extract src from iframe if user pasted the whole thing
    const mapUrl = mapEmbed.includes('<iframe') 
        ? (mapEmbed.match(/src=["'](.+?)["']/)?.[1] || mapEmbed) 
        : mapEmbed

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-emerald-900 py-20 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
                        Kami siap melayani dan menjawab pertanyaan Anda. Jangan ragu untuk menghubungi kami melalui form di bawah ini atau kontak yang tersedia.
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-emerald-500 pl-4">
                                    Informasi Kontak
                                </h3>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Silakan kunjungi madrasah kami atau hubungi melalui kontak di bawah ini pada jam kerja.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Alamat</h4>
                                            <p className="mt-1 text-gray-600">
                                                {address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Telepon / Fax</h4>
                                            <p className="mt-1 text-gray-600">
                                                {phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                                            <p className="mt-1 text-gray-600">
                                                {email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Jam Operasional</h4>
                                            <p className="mt-1 text-gray-600">
                                                Senin - Kamis: 07:00 - 14:00<br />
                                                Jumat - Sabtu: 07:00 - 11:00
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Embedded Map */}
                            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 h-[300px]">
                                <iframe
                                    src={mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
