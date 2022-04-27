import "emoji-mart/css/emoji-mart.css";

import React, { useCallback, useRef, useState } from "react";
import { createEditor, Descendant, Editor, Node } from "slate";
import { withHistory } from "slate-history";
import {
  Slate,
  withReact,
  Editable,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Emoji, Picker } from "emoji-mart";
import { Stack, IconButton, Popover, Typography, Box } from "@mui/material";
import { AddCircle, EmojiEmotions, Gif } from "@mui/icons-material";
import { withEmoji } from "./plugins/withEmoji";
import { withMention } from "./plugins/withMention";
import { withBlockquote } from "./plugins/withBlockquote";
import { withCodeblock } from "./plugins/withCodeblock";
import { insertMention } from "./utils/insertMention";
import { decorateMarkdown } from "./utils/decorateMarkdown";

const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.inlineCode) {
    return (
      <Typography
        sx={{ bgcolor: "grey.400", borderRadius: "3px", p: "2px" }}
        component="code"
        {...attributes}
      >
        {children}
      </Typography>
    );
  } else if (leaf.syntax) {
    return (
      <Typography color="GrayText" component="span" {...attributes}>
        {children}
      </Typography>
    );
  }
  return (
    <Typography
      component="span"
      color={leaf.url ? "blue" : undefined}
      sx={{
        color: leaf.comment
          ? "slategray"
          : leaf.operator || leaf.url
          ? "#9a6e4a"
          : leaf.keyword
          ? "#07a"
          : leaf.variable || leaf.regex
          ? "e90"
          : leaf.number ||
            leaf.boolean ||
            leaf.tag ||
            leaf.constant ||
            leaf.symbol ||
            leaf.selector ||
            leaf["attr-name"]
          ? "#905"
          : leaf.string || leaf.char
          ? "#690"
          : leaf.function || leaf["class-name"]
          ? "#dd4a68"
          : "",
        fontWeight: leaf.strong ? "bold" : undefined,
        fontStyle: leaf.emphasis ? "italic" : undefined,
        textDecoration: `${leaf.underline || leaf.url ? "underline" : ""} ${
          leaf.strikethrough ? "line-through" : ""
        }`,
      }}
      {...attributes}
    >
      {children}
    </Typography>
  );
};

const RenderElement = ({
  element,
  children,
  attributes,
}: RenderElementProps) => {
  switch (element.type) {
    case "emoji":
      return (
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
          }}
          {...attributes}
        >
          <Emoji size={22} set="twitter" emoji={element.emoji} />
          {children}
        </span>
      );
    case "blockquote":
      return (
        <Stack alignItems="center" direction="row" spacing={1} {...attributes}>
          <span
            style={{ width: "4px", background: "#ddd", height: "1.5rem" }}
          />
          <Typography component="blockquote">{children}</Typography>
        </Stack>
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
                  : "primary.dark",
            },
          }}
          {...attributes}
        >
          {element.mentionType === "channel" ? "#" : "@"}
          {element.name}
          {children}
        </Typography>
      );
    case "codeline":
      return (
        <Typography fontFamily="monospace" component="pre" {...attributes}>
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

export const serialize = (nodes: any) => {
  return nodes.map((n: any) => Node.string(n)).join("\n");
};

export default function App() {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [{ text: 'console.log("Hello World");' }],
    },
  ]);
  const editorRef = useRef<Editor | null>(null);
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  if (!editorRef.current)
    editorRef.current = withCodeblock(
      withBlockquote(
        withMention(withEmoji(withHistory(withReact(createEditor())))),
      ),
    );

  const editor = editorRef.current;

  const decorate = useCallback(decorateMarkdown(editor), [editor]);

  const renderElement = useCallback(
    (props: RenderElementProps) => <RenderElement {...props} />,
    [],
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <RenderLeaf {...props} />,
    [],
  );

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(e.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
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
              mentionType: "user",
            });
          }}
          size="small"
        >
          <AddCircle />
        </IconButton>
        <Editable
          spellCheck={false}
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
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
      >
        <Picker
          onSelect={e => {
            editor.insertText(e.colons || "");
            handleClose();
          }}
          set="twitter"
        />
      </Popover>
    </Slate>
  );
}
