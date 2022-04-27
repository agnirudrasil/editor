import { Editor, Text, Transforms, Path, Node } from "slate";
import { isBlockActive } from "../utils/isBlockActive";

export const withCodeblock = (editor: Editor) => {
  const { normalizeNode } = editor;
  editor.normalizeNode = nodeEntry => {
    const [node, path] = nodeEntry;

    if (Text.isText(node) && node.text.startsWith("```")) {
      Transforms.setNodes(
        editor,
        { type: "codeline" },
        {
          at: {
            anchor: { path: Path.next(Path.parent(path)), offset: 0 },
            focus: Editor.end(editor, []),
          },
          match: n => Editor.isBlock(editor, n),
          mode: "all",
        },
      );

      return;
    }
    normalizeNode(nodeEntry);
  };

  return editor;
};
