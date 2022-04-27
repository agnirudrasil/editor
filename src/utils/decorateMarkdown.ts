import { SingleASTNode } from "simple-markdown";
import { Node, NodeEntry, Text, Range } from "slate";
import {
  extraSpaces,
  syntaxTree,
} from "../markdown/parsers/parseMessageContent";

export const decorateMarkdown = ([node, path]: NodeEntry<Node>) => {
  const ranges: Range[] = [];

  if (!Text.isText(node)) {
    return ranges;
  }

  const tokens = syntaxTree(node.text);

  let start = 0;

  const tokenize = (token: SingleASTNode) => {
    if (token?.type === "text") {
      start += token.content.length;
      return;
    } else if (token.type === "url") {
      const end = start + token.content.length;
      ranges.push({
        [token.type]: true,
        anchor: {
          path,
          offset: start,
        },
        focus: {
          path,
          offset: end,
        },
      });
      start = end;
      return;
    } else if (!token) {
      return;
    } else if (token.type === "inlineCode") {
      let end = start + extraSpaces[token.type].syntaxBefore.length;
      ranges.push({
        syntax: true,
        anchor: {
          path,
          offset: start,
        },
        focus: {
          path,
          offset: end,
        },
      });
      start = end;
      end = start + token.content.length;
      ranges.push({
        [token.type]: true,
        anchor: {
          path,
          offset: start,
        },
        focus: {
          path,
          offset: end,
        },
      });
      start = end;
      end = start + extraSpaces[token.type].syntaxAfter.length;
      ranges.push({
        syntax: true,
        anchor: {
          path,
          offset: start,
        },
        focus: {
          path,
          offset: end,
        },
      });
      start = end;
      return;
    } else {
      const actualStart = start;
      let end = start + extraSpaces[token.type].syntaxBefore.length;
      ranges.push({
        syntax: true,
        anchor: {
          path,
          offset: start,
        },
        focus: {
          path,
          offset: end,
        },
      });
      start = end;
      if (Array.isArray(token.content)) {
        token.content.map(tokenize);
      }
      ranges.push({
        [token.type]: true,
        anchor: { path, offset: actualStart },
        focus: { path, offset: start },
      });
      end = start + extraSpaces[token.type].syntaxAfter.length;
      ranges.push({
        syntax: true,
        anchor: {
          path,
          offset: start,
        },
        focus: {
          path,
          offset: end,
        },
      });
      start = end;
      return;
    }
  };

  for (const token of tokens) {
    tokenize(token);
  }

  return ranges;
};
