import Link from "next/link"
import { getUsers, deleteUser } from "@/actions/user"
import { Plus, Trash2, Edit } from "lucide-react"
import { redirect } from "next/navigation"

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-black">
                    Manajemen User
                </h4>
                <Link
                    href="/dashboard/users/create"
                    className="inline-flex items-center gap-2 rounded bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                    Tambah User
                </Link>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Nama</h5>
                    </div>
                    <div className="p-2.5 xl:p-5 text-center sm:block hidden">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Username</h5>
                    </div>
                    <div className="p-2.5 xl:p-5 text-center">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Role / Bio</h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Aksi</h5>
                    </div>
                </div>

                {users.map((user: any) => (
                    <div
                        key={user.id}
                        className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-4"
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden">
                                <img
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <p className="hidden text-black dark:text-white sm:block">
                                {user.name}
                            </p>
                        </div>

                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                            <p className="text-black dark:text-white">{user.username}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-meta-3">{user.bio || '-'}</p>
                        </div>

                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5 gap-2">
                            <Link
                                href={`/dashboard/users/${user.id}/edit`}
                                className="hover:text-primary transition-colors"
                            >
                                <Edit className="w-5 h-5" />
                            </Link>
                            <form action={async () => {
                                "use server"
                                await deleteUser(user.id)
                            }}>
                                <button className="hover:text-red-600 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="p-4 text-center text-gray-500">Tidak ada user ditemukan.</div>
            )}
        </div>
    )
}
