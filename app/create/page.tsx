import PostForm from "@/components/forms/post"

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl">
      <PostForm option="create" />
    </div>
  )
}
