import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getPosts } from "@/server/post"
import Link from "next/link"

export default async function Home() {
  const { data } = await getPosts()
  return (
    <div>
      <h1 className="text-2xl font-bold">Feed</h1>
      <p className="text-muted-foreground">Read posts written by other users</p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {data?.map(({ post, user }) => (
          <Card key={post.id}>
            <CardHeader className="-m-2 flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user?.name![0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-foreground">
                  {user?.name}
                </p>
              </div>
            </CardHeader>
            <CardContent className="-m-2 grow">
              <Link href={`/read/${post.id}`}>
                <CardTitle>{post.title}</CardTitle>
              </Link>
            </CardContent>
            <CardFooter className="-m-2 -my-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {post.createdAt.toLocaleDateString()}
              </p>
              <Button variant="link" asChild>
                <Link href={`/read/${post.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
