
import Link from "next/link"
import { Plus } from "lucide-react"
import { getTeachers, deleteTeacher } from "@/actions/teacher"
import { revalidatePath } from "next/cache"

export default async function GTKDashboardPage() {
    const teachers = await getTeachers()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-black">
                    Data Guru & Staf
                </h4>
                <Link
                    href="/dashboard/gtk/create"
                    className="inline-flex items-center gap-2 rounded bg-emerald-600 py-2 px-4 font-medium text-white hover:bg-emerald-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Baru
                </Link>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 sm:grid-cols-4 bg-gray-100 p-2.5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Nama
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            NIP
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Jabatan
                        </h5>
                    </div>
                    <div className="hidden sm:block p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-gray-600">
                            Aksi
                        </h5>
                    </div>
                </div>

                {teachers.length === 0 ? (
                    <div className="p-5 text-center text-gray-500">
                        Belum ada data guru.
                    </div>
                ) : (
                    teachers.map((teacher, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-4 ${key === teachers.length - 1
                                    ? ""
                                    : "border-b border-stroke border-gray-100"
                                }`}
                            key={teacher.id}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <div className="flex-shrink-0">
                                    {teacher.image ? (
                                        <img className="h-12 w-12 rounded-full object-cover" src={teacher.image} alt="User" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                                    )}
                                </div>
                                <p className="hidden text-black sm:block font-medium">
                                    {teacher.name}
                                </p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{teacher.nip || '-'}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-meta-3 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-sm font-medium">
                                    {teacher.position}
                                </p>
                            </div>

                            <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5 gap-3">
                                <Link
                                    href={`/dashboard/gtk/${teacher.id}/edit`}
                                    className="hover:text-emerald-600 transition-colors"
                                >
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.17812 8.99981 3.17812C14.5686 3.17812 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 9.00001C2.4908 10.0406 5.25918 13.6688 8.99981 13.6688C12.7404 13.6688 15.5088 10.0406 16.1436 9.00001C15.5088 7.95938 12.7404 4.33126 8.99981 4.33126C5.25918 4.33126 2.4908 7.95938 1.85605 9.00001Z"
                                            fill=""
                                        />
                                        <path
                                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                            fill=""
                                        />
                                    </svg>
                                </Link>
                                <form action={async () => {
                                    'use server'
                                    await deleteTeacher(teacher.id)
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
                    ))
                )}
            </div>
        </div>
    )
}
