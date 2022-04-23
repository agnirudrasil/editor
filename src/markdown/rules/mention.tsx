import React from "react";
import { defaultRules, inlineRegex } from "simple-markdown";
import type { MarkdownRule } from "../parsers/MarkdownRule";

const MENTION_RE = /^<(@!?|@&|#)(\d+)>|^(@(?:everyone))/;

const MENTION_TYPES: Record<string, string> = {
  "@": "user",
  "@!": "user",
  "@&": "role",
  "#": "channel"
};

export const mention: MarkdownRule = {
  order: defaultRules.text.order,
  match: inlineRegex(MENTION_RE),
  parse: (capture) => {
    const [, type, digits, everyoneOrHere] = capture;

    if (everyoneOrHere) {
      return {
        content: { id: "", type: "everyone" }
      };
    }

    return {
      content: {
        id: digits,
        type: MENTION_TYPES[type]
      }
    };
  },
  react: (node, _, state) => <span key={state.key}>{node}</span>
};
