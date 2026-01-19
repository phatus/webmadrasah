import { getUser } from "@/actions/user"
import { notFound } from "next/navigation"
import EditUserForm from "./edit-form"

interface PageParams {
    params: Promise<{
        id: string
    }>
}

export default async function EditUserPage({ params }: PageParams) {
    const { id } = await params
    const user = await getUser(parseInt(id))

    if (!user) {
        notFound()
    }

    return (
        <div className="max-w-4xl bg-white p-6 rounded shadow border border-stroke">
            <h1 className="text-2xl font-bold mb-6 text-black">Edit User</h1>
            <EditUserForm user={user} />
        </div>
    )
}
