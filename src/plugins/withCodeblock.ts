import { Editor, Text, Transforms } from "slate";
import { isBlockActive } from "../utils/isBlockActive";

export const withCodeblock = (editor: Editor) => {
  const { normalizeNode } = editor;
  editor.normalizeNode = nodeEntry => {
    const [node, path] = nodeEntry;

    if (
      Text.isText(node) &&
      !node.text.startsWith("```") &&
      isBlockActive(editor, "codeblock")
    ) {
      Transforms.setNodes(
        editor,
        { type: "paragraph" },
        { match: n => Editor.isBlock(editor, n) },
      );
    }

    if (
      Text.isText(node) &&
      node.text.startsWith("```") &&
      !isBlockActive(editor, "codeblock")
    ) {
      Transforms.setNodes(
        editor,
        { type: "codeblock" },
        { match: n => Editor.isBlock(editor, n) },
      );
    }
    normalizeNode(nodeEntry);
  };

  return editor;
};
