import "emoji-mart/css/emoji-mart.css";

import React, { useCallback, useRef, useState } from "react";
import { createEditor, Editor, Node, NodeEntry, Range, Text } from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  withReact,
  Editable,
  RenderElementProps,
  RenderLeafProps
} from "slate-react";
import { Emoji, Picker } from "emoji-mart";
import { Stack, IconButton, Popover, Typography } from "@mui/material";
import { AddCircle, EmojiEmotions, Gif } from "@mui/icons-material";
import { withEmoji } from "./plugins/withEmoji";
import { withMention } from "./plugins/withMention";
import { insertMention } from "./utils/insertMention";

const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.code) {
    return <code {...attributes}>{children}</code>;
  }

  return (
    <span
      style={{
        color: leaf.syntax ? "#ccc" : "black",
        fontWeight: leaf.bold ? "bold" : undefined,
        fontStyle: leaf.italic ? "italic" : undefined,
        textDecoration: leaf.underlined ? "underline" : undefined
      }}
      {...attributes}
    >
      {children}
    </span>
  );
};

const RenderElement = ({
  element,
  children,
  attributes
}: RenderElementProps) => {
  switch (element.type) {
    case "emoji":
      return (
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle"
          }}
          {...attributes}
        >
          <Emoji size={22} set="twitter" emoji={element.emoji} />
          {children}
        </span>
      );
    case "mention":
      return (
        <Typography
          component="span"
          sx={{
            display: "inline",
            verticalAlign: "middle",
            bgcolor:
              element.mentionType === "role"
                ? "secondary.main"
                : "primary.main",
            color: "white",
            borderRadius: "3px",
            p: 0.5,
            transition: "background-color 300ms ease",
            "&:hover": {
              bgcolor:
                element.mentionType === "role"
                  ? "secondary.dark"
                  : "primary.dark"
            }
          }}
          {...attributes}
        >
          {element.mentionType === "channel" ? "#" : "@"}
          {element.name}
          {children}
        </Typography>
      );
    default:
      return (
        <Typography {...attributes} component="p">
          {children}
        </Typography>
      );
  }
};

export default function App() {
  const editorRef = useRef<Editor | null>(null);
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  if (!editorRef.current)
    editorRef.current = withMention(
      withEmoji(withHistory(withReact(createEditor())))
    );

  const editor = editorRef.current;

  const decorate = useCallback(([node, path]: NodeEntry<Node>) => {
    const ranges: Range[] = [];

    return ranges;
  }, []);

  const renderElement = useCallback(
    (props: RenderElementProps) => <RenderElement {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <RenderLeaf {...props} />,
    []
  );

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(e.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <Slate
      editor={editor}
      value={[{ type: "paragraph", children: [{ text: "" }] }]}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{ bgcolor: "grey.200", borderRadius: 1, p: 1, m: 2 }}
      >
        <IconButton
          onClick={() => {
            insertMention(editor, {
              id: "123",
              name: "Agnirudra Sil",
              mentionType: "user"
            });
          }}
          size="small"
        >
          <AddCircle />
        </IconButton>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{ flex: "1" }}
          placeholder="Message #general"
          decorate={decorate}
        />
        <IconButton onClick={handleOpen} size="small">
          <EmojiEmotions />
        </IconButton>
        <IconButton size="small">
          <Gif />
        </IconButton>
      </Stack>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
      >
        <Picker
          onSelect={(e) => {
            editor.insertText(e.colons || "");
            handleClose();
          }}
          set="twitter"
        />
      </Popover>
    </Slate>
  );
}
