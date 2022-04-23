import { EmojiData } from "emoji-mart";
import { Editor, Transforms, Location } from "slate";

export const insertEmoji = (
  editor: Editor,
  emoji: EmojiData,
  at?: Location
) => {
  Transforms.insertNodes(
    editor,
    [
      {
        type: "emoji",
        emoji,
        children: [{ text: "" }]
      },
      {
        text: " "
      }
    ],
    { at }
  );
};
