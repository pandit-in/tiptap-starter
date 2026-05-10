import PostForm from "@/components/forms/post"
import { getPostById } from "@/server/post"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data } = await getPostById(id)

  const initialData = data?.post
    ? {
        title: data.post.title,
        content: data.post.content,
        coverImage: data.post.coverImage || "",
      }
    : undefined

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <PostForm option="edit" postId={id} initialData={initialData} />
    </div>
  )
}
