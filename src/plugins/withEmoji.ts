import { emojiIndex } from "emoji-mart";
import { Editor, Text } from "slate";
import { insertEmoji } from "../utils/insertEmoji";

export const withEmoji = (editor: Editor) => {
  const { normalizeNode, isInline, isVoid } = editor;

  editor.isInline = (element) =>
    element.type === "emoji" ? true : isInline(element);

  editor.isVoid = (element) =>
    element.type === "emoji" ? true : isVoid(element);

  editor.normalizeNode = (nodeEntry) => {
    const [node, path] = nodeEntry;
    if (Text.isText(node) && /:.*?:/.test(node.text)) {
      const match = /:(.*?):/.exec(node.text);

      const index = node.text.indexOf(match![0]);

      const emoji = emojiIndex.search(match![1])?.[0];

      if (emoji) {
        insertEmoji(editor, emoji, {
          anchor: {
            path,
            offset: index
          },
          focus: {
            path,
            offset: index + match![0].length
          }
        });
        return;
      }
    }

    normalizeNode(nodeEntry);
  };

  return editor;
};
