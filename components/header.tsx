"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTransition } from "react"

export default function Header() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { data: session } = authClient.useSession()

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut()
    })
    router.push("/")
    toast.success("Signed out successfully")
  }

  return (
    <header className="fixed top-0 z-20 w-full border-b bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <Link className="text-2xl font-bold" href={"/"}>
          Medium
        </Link>
        <nav className="space-x-2">
          {session ? (
            <div className="flex items-center space-x-2">
              <Button
                variant={"secondary"}
                onClick={() => router.push("/simple")}
              >
                Simple
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => router.push("/create")}
              >
                New post
              </Button>
              <Button
                variant={"destructive"}
                onClick={handleSignOut}
                disabled={isPending}
              >
                {isPending ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          ) : (
            <Button variant={"outline"} asChild>
              <Link href={"/signin"}>Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
