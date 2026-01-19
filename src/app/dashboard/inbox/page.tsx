
import { getInquiries, deleteInquiry, markInquiryAsRead } from "@/actions/inquiry"
import { Trash2, Mail, MailOpen } from "lucide-react"

export const metadata = {
    title: "Kotak Masuk | Web Madrasah",
}

export default async function InboxPage() {
    const inquiries = await getInquiries()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-xl font-semibold text-black">
                        Kotak Masuk
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Pesan dari formulir kontak website
                    </p>
                </div>
                <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {inquiries.length} Pesan
                </div>
            </div>

            <div className="flex flex-col gap-4 mb-6">
                {inquiries.map((item: any) => (
                    <div
                        key={item.id}
                        className={`relative rounded border p-4 transition-all hover:bg-gray-50 ${item.isRead ? 'border-stroke bg-white' : 'border-emerald-200 bg-emerald-50/30'}`}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${item.isRead ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {item.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                                </div>
                                <div>
                                    <h5 className="font-semibold text-black text-sm md:text-base">
                                        {item.name} <span className="text-gray-500 font-normal">&lt;{item.email}&gt;</span>
                                    </h5>
                                    <span className="text-xs text-gray-500">
                                        {new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-auto">
                                {!item.isRead && (
                                    <form action={async () => {
                                        "use server"
                                        await markInquiryAsRead(item.id)
                                    }}>
                                        <button className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 transition">
                                            Tandai Dibaca
                                        </button>
                                    </form>
                                )}
                                <form action={async () => {
                                    "use server"
                                    await deleteInquiry(item.id)
                                }}>
                                    <button
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                        title="Hapus Pesan"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="pl-0 md:pl-14">
                            {item.subject && (
                                <p className="text-sm font-semibold text-gray-800 mb-1">
                                    Subjek: {item.subject}
                                </p>
                            )}
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {item.message}
                            </p>
                        </div>
                    </div>
                ))}

                {inquiries.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        Belum ada pesan masuk.
                    </div>
                )}
            </div>
        </div>
    )
}
