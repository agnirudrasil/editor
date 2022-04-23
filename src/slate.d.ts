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
  | MentionElement;

export type FormattedText = { text: string; bold?: boolean; syntax?: boolean };

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
