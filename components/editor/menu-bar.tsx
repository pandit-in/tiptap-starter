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
  Link,
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
import { UploadDropzone } from "@/lib/uploadthing"
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

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
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant={"ghost"} size={"icon"}>
                <Link />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Link</DialogTitle>
                <DialogDescription>
                  Set the link in full URL like https://example.com
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link-url">Link URL</Label>
                  <Input
                    placeholder="https://example.com"
                    id="link-url"
                    onChange={(e) =>
                      editor
                        .chain()
                        .focus()
                        .setLink({ href: e.target.value })
                        .run()
                    }
                    value={editorState.href || ""}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setLink({ href: editorState.href })
                        .run()
                    }
                  >
                    Set Link
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={editorState.isBlockquote}
          >
            <Quote />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant={"ghost"} size={"icon"}>
                <ImageIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Set Image</DialogTitle>
                <DialogDescription>
                  Upload your image or provide a link.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="grid flex-1 gap-2">
                  <Input
                    placeholder="https://example.com"
                    id="image-url"
                    onChange={(e) =>
                      editor
                        .chain()
                        .focus()
                        .setImage({ src: e.target.value })
                        .run()
                    }
                    value={editorState.image.src || ""}
                  />
                </div>
                <div className="w-full cursor-pointer">
                  <UploadDropzone
                    className="h-48 w-full border-2 border-red-500/20 hover:border-red-500/30 ut-button:bg-red-500 ut-button:p-3 ut-button:text-sm ut-button:hover:bg-red-500 ut-allowed-content:hidden ut-label:text-sm ut-label:text-muted-foreground ut-upload-icon:size-40"
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      res.forEach((item) => {
                        toast.success("Image uploaded successfully")
                        editor
                          .chain()
                          .focus()
                          .setImage({ src: item.ufsUrl })
                          .run()
                      })
                    }}
                    onUploadError={(error) => {
                      toast.error(`Upload failed: ${error.message}`)
                    }}
                  />
                </div>
              </div>
              <DialogFooter className="justify-end">
                <DialogClose asChild>
                  <Button type="button">Insert Image</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
