"use client"

import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { authClient } from "@/lib/auth-client"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const formSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormSchema = z.infer<typeof formSchema>

export default function SigninPage() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(data: FormSchema) {
    startTransition(async () => {
      try {
        const { error } = await authClient.signUp.email({
          name: data.name,
          email: data.email,
          password: data.password,
        })

        if (error) {
          toast.error(error.message)
          return
        }
        toast.success("Account created successfully")
      } catch (error) {
        console.log(error)
        toast.error("Failed to create account")
      }
    })
  }

  return (
    <div className="items flex h-[85vh] flex-col justify-center gap-4">
      <form
        id="signin"
        onSubmit={form.handleSubmit(onSubmit)}
        className="pt-18"
      >
        <FieldGroup className="mx-auto flex w-full max-w-sm flex-col gap-4">
          <div className="flex items-center">
            <p className="text-2xl font-semibold">Create account</p>
          </div>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input {...field} placeholder="John Doe" autoComplete="name" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  placeholder="m@example.com"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  type="password"
                  autoComplete="current-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            form="signin"
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?
            </p>
            <Link href={"/signin"} className="text-sm underline">
              Sign in
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
