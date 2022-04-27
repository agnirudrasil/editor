import { Editor, Element } from "slate";

export const isBlockActive = (
  editor: Editor,
  format: string,
  blockType: "type" = "type",
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format,
    }),
  );

  return !!match;
};
