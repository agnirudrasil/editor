import { Editor, Location, Transforms } from "slate";

interface Mention {
  id: string;
  name: string;
  mentionType: "@everyone" | "user" | "role" | "channel";
}

export const insertMention = (
  editor: Editor,
  mention: Mention,
  at?: Location
) => {
  Transforms.insertNodes(
    editor,
    [
      {
        type: "mention",
        ...mention,
        children: [{ text: "" }]
      },
      { text: " " }
    ],
    { at, select: true }
  );
};
