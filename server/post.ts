"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/db"
import { post } from "@/db/schema/post"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"
import { user } from "@/db/schema"

export async function createPost(
  title: string,
  content: string,
  coverImage?: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error("Unauthorized")
    }
    await db.insert(post).values({
      id: randomUUID(),
      title,
      content,
      coverImage,
      authorId: session.user.id,
      createdAt: new Date(),
    })
    return {
      success: true,
      message: "Post created successfully",
    }
  } catch (error) {
    const e = error as Error
    return {
      success: false,
      message: e.message || "Failed to create post",
    }
  }
}

export async function getPostById(id: string) {
  try {
    const posts = await db
      .select()
      .from(post)
      .where(eq(post.id, id))
      .leftJoin(user, eq(post.authorId, user.id))

    if (posts.length === 0) {
      return {
        success: false,
        message: "Post not found",
      }
    }

    return {
      success: true,
      data: posts[0],
    }
  } catch (error) {
    const e = error as Error
    return {
      success: false,
      message: e.message || "Failed to get posts",
    }
  }
}

export async function getPosts() {
  try {
    const posts = await db
      .select()
      .from(post)
      .leftJoin(user, eq(post.authorId, user.id))

    if (posts.length === 0) {
      return {
        success: false,
        message: "Post not found",
      }
    }

    return {
      success: true,
      data: posts,
    }
  } catch (error) {
    const e = error as Error
    return {
      success: false,
      message: e.message || "Failed to get posts",
    }
  }
}

export async function updatePost(
  id: string,
  title: string,
  content: string,
  coverImage?: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error("Unauthorized")
    }

    const posts = await db.select().from(post).where(eq(post.id, id))
    if (posts.length === 0) {
      throw new Error("Post not found")
    }

    if (posts[0].authorId !== session.user.id) {
      throw new Error("You are not authorized to edit this post")
    }

    await db
      .update(post)
      .set({ title, content, coverImage, updatedAt: new Date() })
      .where(eq(post.id, id))

    return {
      success: true,
      message: "Post updated successfully",
    }
  } catch (error) {
    const e = error as Error
    return {
      success: false,
      message: e.message || "Failed to update post",
    }
  }
}
