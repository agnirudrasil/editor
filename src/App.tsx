import "emoji-mart/css/emoji-mart.css";

import { useRef, useState } from "react";
import { createEditor, Editor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact, Editable } from "slate-react";
import { Picker } from "emoji-mart";

export default function App() {
  const editorRef = useRef<Editor | null>(null);
  const [open, setOpen] = useState(false);
  if (!editorRef.current)
    editorRef.current = withHistory(withReact(createEditor()));

  const editor = editorRef.current;

  return (
    <Slate
      editor={editor}
      value={[{ type: "paragraph", children: [{ text: "" }] }]}
    >
      <div
        style={{
          background: "#ccc",
          padding: ".75rem",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem"
        }}
      >
        <Editable
          style={{ flex: "1" }}
          placeholder="Message #general"
          decorate={() => []}
        />
        <button
          onClick={() => {
            setOpen((o) => !o);
          }}
        >
          Emoji
        </button>
      </div>
      {open && <Picker set="twitter" />}
    </Slate>
  );
}
