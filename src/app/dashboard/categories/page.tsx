import Link from "next/link"
import { getCategories, deleteCategory } from "@/actions/category"

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-black">
                    Manajemen Kategori
                </h4>
                <Link
                    href="/dashboard/categories/create"
                    className="inline-flex items-center gap-2 rounded bg-emerald-600 py-2 px-4 font-medium text-white hover:bg-emerald-700 transition"
                >
                    + Buat Kategori
                </Link>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 sm:grid-cols-4 bg-gray-100 p-2.5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Nama Kategori
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Slug
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Jumlah Berita
                        </h5>
                    </div>
                    <div className="hidden sm:block p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Aksi
                        </h5>
                    </div>
                </div>

                {categories.map((cat: any, key: number) => (
                    <div
                        className={`grid grid-cols-3 sm:grid-cols-4 ${key === categories.length - 1
                                ? ""
                                : "border-b border-stroke border-gray-100"
                            }`}
                        key={cat.id}
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="hidden text-black sm:block font-medium">
                                {cat.name}
                            </p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black">{cat.slug}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {cat._count.posts} Post
                            </span>
                        </div>

                        <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5 gap-3">
                            <form action={async () => {
                                "use server"
                                await deleteCategory(cat.id)
                            }}>
                                <button className="hover:text-red-600 transition-colors">
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13.7531 2.47502H11.5875V1.9969C11.5875 1.15315 10.9125 0.478149 10.0688 0.478149H7.90312C7.05938 0.478149 6.38438 1.15315 6.38438 1.9969V2.47502H4.21875C3.7125 2.47502 3.29062 2.8969 3.29062 3.40315V4.33127C3.29062 4.83752 3.7125 5.2594 4.21875 5.2594H13.7531C14.2594 5.2594 14.6812 4.83752 14.6812 4.33127V3.40315C14.6812 2.8969 14.2594 2.47502 13.7531 2.47502ZM7.67812 1.9969C7.67812 1.85627 7.79062 1.74377 7.93125 1.74377H10.0406C10.1812 1.74377 10.2937 1.85627 10.2937 1.9969V2.47502H7.67812V1.9969Z"
                                            fill=""
                                        />
                                        <path
                                            d="M14.2312 6.35625H3.74062C3.2625 6.35625 2.925 6.80625 3.00937 7.28438L4.05 16.3406C4.13437 17.0719 4.75312 17.6344 5.48437 17.6344H12.4875C13.2187 17.6344 13.8375 17.0719 13.9219 16.3406L14.9625 7.28438C15.0469 6.80625 14.7094 6.35625 14.2312 6.35625ZM7.67813 14.625C7.67813 15.0187 7.34062 15.3562 6.94688 15.3562C6.55312 15.3562 6.21562 15.0187 6.21562 14.625V9.42187C6.21562 9.02812 6.55312 8.69062 6.94688 8.69062C7.34062 8.69062 7.67813 9.02812 7.67813 9.42187V14.625ZM11.7281 14.625C11.7281 15.0187 11.3906 15.3562 10.9969 15.3562C10.6031 15.3562 10.2656 15.0187 10.2656 14.625V9.42187C10.2656 9.02812 10.6031 8.69062 10.9969 8.69062C11.3906 8.69062 11.7281 9.02812 11.7281 9.42187V14.625Z"
                                            fill=""
                                        />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="p-5 text-center text-gray-500">
                        Belum ada kategori.
                    </div>
                )}
            </div>
        </div>
    )
}
