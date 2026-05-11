"use client"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError } from "../ui/field"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/button"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { createPost, updatePost } from "@/server/post"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Editor from "../editor"
import { UploadDropzone } from "@/lib/uploadthing"

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
              <div className="mb-6 flex flex-col gap-4">
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {field.value ? (
                    <div className="relative mt-2 w-full">
                      <div className="relative w-full">
                        <Image
                          src={field.value}
                          alt="Cover image"
                          width={1280}
                          height={720}
                          className="h-48 w-full rounded-md object-cover"
                        />
                      </div>
                      <Button
                        variant={"destructive"}
                        type="button"
                        size={"icon"}
                        className="absolute top-2 right-2"
                        onClick={() => field.onChange("")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full cursor-pointer">
                      <UploadDropzone
                        className="h-48 w-full border-2 border-red-500/10 hover:border-red-500/20 ut-button:bg-red-500 ut-button:p-3 ut-button:text-sm ut-button:hover:bg-red-500 ut-allowed-content:hidden ut-label:text-sm ut-label:text-muted-foreground ut-upload-icon:size-40"
                        endpoint="coverImageUploader"
                        onClientUploadComplete={(res) => {
                          if (res) field.onChange(res[0].ufsUrl)
                          toast.success("Cover image uploaded successfully")
                        }}
                        onUploadError={(error) => {
                          toast.error(error.message)
                        }}
                      />
                    </div>
                  )}
                </div>
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
                className="resize-none overflow-hidden text-3xl font-bold outline-none"
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
