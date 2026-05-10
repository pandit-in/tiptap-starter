"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { TableKit } from "@tiptap/extension-table"
import { TextStyleKit } from "@tiptap/extension-text-style"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { MenuBar } from "./menu-bar"
import { cn } from "@/lib/utils"

import { all, createLowlight } from "lowlight"
const lowlight = createLowlight(all)

lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

export default function Editor({
  content,
  onChange,
  readonly,
}: {
  content?: string
  onChange?: (content: string) => void
  readonly?: boolean
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,
      Image,
      TableKit,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    editorProps: {
      attributes: {
        class: "max-w-none min-h-64 w-full outline-none",
      },
    },
    content,
    immediatelyRender: false,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div>
      {!readonly && editor && (
        <div className="sticky top-17 z-50 px-4 sm:px-0">
          <MenuBar editor={editor} />
        </div>
      )}
      <div className="px-4 sm:px-0">
        <div className={cn(!readonly && "border p-4")}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
