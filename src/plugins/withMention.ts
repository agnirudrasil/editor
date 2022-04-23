import { Editor, Text } from "slate";
import { insertMention } from "../utils/insertMention";

export const withMention = (editor: Editor) => {
  const { isInline, isVoid, normalizeNode } = editor;

  editor.isInline = (element) =>
    element.type === "mention" ? true : isInline(element);

  editor.isVoid = (element) =>
    element.type === "mention" ? true : isVoid(element);

  editor.normalizeNode = (nodeEntry) => {
    const [node, path] = nodeEntry;
    if (Text.isText(node) && /<(@|#|@&|:.+?:)(\d+?)>/.test(node.text)) {
      const [complete, type, id] =
        /<(@|#|@&|:.+?:)(\d+?)>/.exec(node.text) || [];
      const index = node.text.indexOf(complete);

      insertMention(
        editor,
        {
          id,
          name: "Agnirudra Sil",
          mentionType:
            type === "#" ? "channel" : type === "@&" ? "role" : "user"
        },
        {
          anchor: { path, offset: index },
          focus: { path, offset: index + complete.length }
        }
      );

      return;
    }
    normalizeNode(nodeEntry);
  };

  return editor;
};
