import { notFound } from "next/navigation"
import { getCategoryById } from "@/actions/category"
import EditCategoryClient from "./EditCategoryClient"

export default async function EditCategoryPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const categoryId = Number(id)
    if (isNaN(categoryId)) notFound()

    const category = await getCategoryById(categoryId)
    if (!category) notFound()

    return <EditCategoryClient category={category} />
}
