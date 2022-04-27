import Prism from "prismjs";
import { SingleASTNode } from "simple-markdown";
import { Node, NodeEntry, Text, Range, Editor } from "slate";
import {
  extraSpaces,
  syntaxTree,
} from "../markdown/parsers/parseMessageContent";

export const getLength = (token: string | Prism.Token): number => {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  } else {
    return (token.content as (string | Prism.Token)[]).reduce(
      (l, t) => l + getLength(t),
      0,
    );
  }
};

export const decorateMarkdown = (editor: Editor) => ([node, path]: NodeEntry<
  Node
>) => {
  const ranges: any[] = [];

  if (!Text.isText(node)) {
    return ranges;
  }

  const tokens = syntaxTree(node.text);

  let start = 0;

  const parent = Node.parent(editor, path);

  if ((parent as any).type === "codeline") {
    const tokens = Prism.tokenize(node.text, Prism.languages["javascript"]);

    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  } else {
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
  }
};
