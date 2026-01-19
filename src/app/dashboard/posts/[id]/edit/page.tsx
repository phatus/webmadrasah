import { getPostById } from "@/actions/post"
import { notFound } from "next/navigation"
import EditPostForm from "../../edit-form"

// Correctly typing params for Next.js 15+ (Params is a Promise)
type Props = {
    params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
    const { id } = await params
    const post = await getPostById(parseInt(id))

    if (!post) {
        notFound()
    }

    return (
        <EditPostForm post={post} />
    )
}
