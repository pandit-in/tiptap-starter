import type { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"

import { menuBarStateSelector } from "./menubar-state"
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
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

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  })

  return (
    <div>
      <div className="overflow-x-auto border bg-card">
        <div className="flex w-max items-center p-2">
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            aria-label="Toggle H1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            disabled={editorState.isHeading1}
          >
            <Heading1 />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            aria-label="Toggle H2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            disabled={editorState.isHeading2}
          >
            <Heading2 />
          </Button>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            disabled={editorState.isHeading3}
          >
            <Heading3 />
          </Button>
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
            <Code />
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
