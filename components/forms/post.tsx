"use client"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError } from "../ui/field"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/button"
import { Sparkles, Upload } from "lucide-react"
import { useTransition } from "react"
import { createPost, updatePost } from "@/server/post"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Editor from "../editor"

const formSchema = z.object({
  coverImage: z.string().optional(),
  title: z.string(),
  content: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

export default function PostForm({
  option,
  postId,
  initialData,
}: {
  option: "create" | "edit"
  postId?: string
  initialData?: FormSchema
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      coverImage: "",
    },
  })

  function onSubmit(data: FormSchema) {
    startTransition(async () => {
      try {
        let result
        if (option === "edit" && postId) {
          result = await updatePost(
            postId,
            data.title,
            data.content,
            data.coverImage
          )
        } else {
          result = await createPost(data.title, data.content, data.coverImage)
        }

        if (!result.success) {
          toast.error(result.message)
          return
        }
        toast.success(result.message)
        router.push(postId ? `/read/${postId}` : "/")
      } catch (error) {
        console.log(error)
        toast.error("Failed to save post")
      }
    })
  }

  return (
    <form id="create-post" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="px-4 sm:px-0">
        <Controller
          name="coverImage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="mb-6 flex items-center gap-4">
                {field.value && (
                  <Image
                    src={field.value}
                    alt="Cover image"
                    width={100}
                    height={100}
                  />
                )}
                <Button variant={"outline"} size={"lg"}>
                  <Upload />
                  Upload Cover Image
                </Button>
                <Button variant={"outline"} size={"lg"}>
                  <Sparkles />
                  Generate Image
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <textarea
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Post title here"
                className="mb-6 resize-none overflow-hidden text-3xl font-bold outline-none"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div>
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <Field>
              <Editor content={field.value} onChange={field.onChange} />
            </Field>
          )}
        />
      </div>

      <div className="sticky bottom-0 flex items-center justify-end gap-2 border bg-card p-2">
        <Button variant={"secondary"} type="button" disabled={isPending}>
          Draft
        </Button>
        <Button form="create-post" type="submit" disabled={isPending}>
          {isPending
            ? option === "edit"
              ? "Updating..."
              : "Publishing..."
            : option === "edit"
              ? "Update"
              : "Publish"}
        </Button>
      </div>
    </form>
  )
}
