import type { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"

import { menuBarStateSelector } from "./menubar-state"
import {
  Bold,
  ChevronDown,
  CodeXml,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  TextWrap,
  Undo2,
} from "lucide-react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { UploadButton } from "@/lib/uploadthing"
import { toast } from "sonner"

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  })

  return (
    <div>
      <div className="overflow-x-auto border bg-card">
        <div className="flex w-max items-center p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant={"ghost"} aria-label="Toggle H1">
                <Heading />
                <ChevronDown size={0.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                <Heading1 />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <Heading2 />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                <Heading3 />
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
          >
            <Bold />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
          >
            <Italic />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
          >
            <Strikethrough />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editorState.canCode}
          >
            <CodeXml />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().setParagraph().run()}
            disabled={editorState.isParagraph}
          >
            <Pilcrow />
          </Button>

          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={editorState.isBulletList}
          >
            <List />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={editorState.isOrderedList}
          >
            <ListOrdered />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={editorState.isCodeBlock}
          >
            <SquareCode />
          </Button>

          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={editorState.isBlockquote}
          >
            <Quote />
          </Button>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              res.forEach((item) => {
                toast.success("Image uploaded successfully")
                editor.chain().focus().setImage({ src: item.ufsUrl }).run()
              })
            }}
            onUploadError={(error) => {
              toast.error(`Upload failed: ${error.message}`)
            }}
            className="ml-2 ut-button:h-6 ut-button:w-6 ut-button:bg-card ut-button:outline-none ut-allowed-content:hidden"
            content={{ button: <ImageIcon className="h-4 w-4" /> }}
          />
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <TextWrap />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editorState.canUndo}
          >
            <Undo2 />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editorState.canRedo}
          >
            <Redo2 />
          </Button>
        </div>
      </div>
    </div>
  )
}
