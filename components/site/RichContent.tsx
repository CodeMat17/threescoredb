"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export function RichContent({ value }: { value: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value ?? "",
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none dark:prose-invert",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value) editor.commands.setContent(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  return <EditorContent editor={editor} />;
}
