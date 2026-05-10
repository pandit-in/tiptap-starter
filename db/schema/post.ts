import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./auth"
import { relations } from "drizzle-orm"

export const postStatus = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
])

export const post = pgTable("post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  coverImage: text("cover_image"),
  content: text("content").notNull(),
  status: postStatus("status").notNull().default("draft"),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
})

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
}))
