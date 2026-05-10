import Editor from "@/components/editor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { getPostById } from "@/server/post"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data } = await getPostById(id)
  const author = data?.user
  const post = data?.post
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthor = session?.user.id === author?.id
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-0">
      <h1 className="mb-10 text-4xl font-bold">{post?.title}</h1>
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage src={author?.image || ""} />
            <AvatarFallback>{author?.name![0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{author?.name}</p>
            <p className="text-xs text-muted-foreground">
              {post?.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        {isAuthor && (
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={`/edit/${id}`}>Edit</Link>
          </Button>
        )}
      </div>
      {post?.coverImage && (
        <div className="relative mb-10 h-64">
          <Image src={post?.coverImage} alt="Cover image" fill />
        </div>
      )}
      <Editor content={post?.content} readonly />
      <div>
        <Editor readonly content={post?.content} />
      </div>
    </div>
  )
}
