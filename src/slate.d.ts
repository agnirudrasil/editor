import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import { EmojiData } from "emoji-mart";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type EmojiElement = {
  type: "emoji";
  emoji: EmojiData;
  children: CustomText[];
};

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type CodeblockElement = {
  type: "codeblock";
  children: CustomText[];
};

export type CodelineElement = {
  type: "codeline";
  children: CustomText[];
};

export type BlockquoteElement = {
  type: "blockquote";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type MentionElement = {
  type: "mention";
  id: string;
  name: string;
  mentionType: "@everyone" | "user" | "role" | "channel";
  children: CustomText[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | EmojiElement
  | BlockquoteElement
  | CodeblockElement
  | CodelineElement
  | MentionElement;

export type FormattedText = {
  text: string;
  type?: string;
  inlineCode?: boolean;
  url?: boolean;
  strong?: boolean;
  emphasis?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  syntax?: boolean;
  spoiler?: boolean;
  comment?: boolean;
  operator?: boolean;
  keyword?: boolean;
  variable?: boolean;
  regex?: boolean;
  number?: boolean;
  boolean?: boolean;
  tag?: boolean;
  constant?: boolean;
  symbol?: boolean;
  selector?: boolean;
  string?: boolean;
  function?: boolean;
  char?: boolean;
  "class-name"?: boolean;
  "attr-name"?: boolean;
};

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
