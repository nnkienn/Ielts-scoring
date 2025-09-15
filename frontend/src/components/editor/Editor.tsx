"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, Undo2, Redo2, Trash2 } from "lucide-react";

interface EditorUIProps {
  onChange: (text: string) => void;
}

export default function EditorUI({ onChange }: EditorUIProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "✍️ Start typing here...",
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getText()); // emit plain text
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full bg-white p-4 rounded-2xl shadow min-h-[500px] flex flex-col">
      <div className="flex-1 bg-gray-50 rounded-xl shadow-inner min-h-[400px] border border-gray-200 focus-within:border-teal-500">
        <EditorContent
          editor={editor}
          className="w-full h-full p-4 text-gray-800 text-base outline-none"
        />
      </div>

      <div className="flex gap-2 text-gray-600 mt-3">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </button>
        <button onClick={() => editor.commands.clearContent()}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
