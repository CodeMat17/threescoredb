"use client";
import BulletList from "@tiptap/extension-bullet-list";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { useEffect, useRef } from "react";

export function TiptapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: { class: "list-disc pl-6 my-2" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal pl-6 my-2" },
      }),
      ListItem,
      Image,
    ],
    content: value ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] rounded-b-md border border-t-0 p-3 focus:outline-none prose prose-sm max-w-none",
      },
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editor) return;
    if (typeof value === "string") {
      editor.commands.setContent(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  return (
    <div>
      <div className='flex flex-wrap items-center gap-1 rounded-t-md border bg-muted/40 p-2'>
        <button
          type='button'
          className='rounded p-1 hover:bg-muted'
          onClick={() => editor?.chain().focus().toggleBold().run()}
          aria-label='Bold'>
          <Bold className='h-4 w-4' />
        </button>
        <button
          type='button'
          className='rounded p-1 hover:bg-muted'
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          aria-label='Italic'>
          <Italic className='h-4 w-4' />
        </button>
        <div className='mx-2 h-4 w-px bg-border' />
        <button
          type='button'
          className='rounded p-1 hover:bg-muted'
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          aria-label='Bullet list'>
          <List className='h-4 w-4' />
        </button>
        <button
          type='button'
          className='rounded p-1 hover:bg-muted'
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          aria-label='Ordered list'>
          <ListOrdered className='h-4 w-4' />
        </button>
        <div className='mx-2 h-4 w-px bg-border' />
        {/* Image upload removed per request */}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

