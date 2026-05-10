import PostForm from "@/components/forms/post"

export default function Page() {
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <PostForm option="create" />
    </div>
  )
}
