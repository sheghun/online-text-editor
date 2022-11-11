import {
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
  genKey,
  RawDraftContentState,
  RichUtils,
  SelectionState,
} from "draft-js";

import { v4 as uuid } from "uuid";

export interface IFile {
  id?: string;
  name: string;
  content: RawDraftContentState;
}

export const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

export const insertCodeBlock = (editorState: EditorState) => {
  const newBlock = new ContentBlock({
    key: genKey(),
    type: editorState.getCurrentInlineStyle().has("CODE") ? "unstyled" : "CODE",
    text: "",
  });

  editorState = RichUtils.insertSoftNewline(editorState);

  const contentState = editorState.getCurrentContent();
  const newBlockMap = contentState
    .getBlockMap()
    .set(newBlock.getKey(), newBlock);

  return EditorState.forceSelection(
    EditorState.push(
      editorState,
      ContentState.createFromBlockArray(newBlockMap.toArray())
        .set("selectionBefore", contentState.getSelectionBefore())
        .set("selectionAfter", contentState.getSelectionAfter()) as any,
      "insert-fragment"
    ),
    SelectionState.createEmpty(newBlock.getKey())
  );
};

export const extractCode = (editorState: EditorState) => {
  const contentBlocks = convertToRaw(editorState.getCurrentContent());
  console.log(contentBlocks);
  return contentBlocks.blocks.reduce((code, block) => {
    if (block.type === "CODE") {
      code += `${block.text}\n`;
    }
    return code;
  }, "");
};

export const initFile = (): IFile => {
  return {
    name: "index.nb",
    content: {
      blocks: [
        {
          key: "3lmf0",
          text: "This is a simple notebook that runs python code\n\n",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: "avhhh",
          text: "from pprint import pprint\n\n\n",
          type: "CODE",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: 28,
              style: "CODE",
            },
          ],
          entityRanges: [],
          data: {},
        },
        {
          key: "46tm1",
          text: "we'll define a function to run our python code\n\n",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: "dv471",
          text: "def print_hi(name):",
          type: "CODE",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: 19,
              style: "CODE",
            },
          ],
          entityRanges: [],
          data: {},
        },
        {
          key: "ch9jg",
          text: "    pprint(f'Hi, {name}')\n\n",
          type: "CODE",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: 27,
              style: "CODE",
            },
          ],
          entityRanges: [],
          data: {},
        },
        {
          key: "fggfs",
          text: "the boy is here\n\n\n",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: "7h1mo",
          text: "print_hi('Segun')",
          type: "CODE",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: 17,
              style: "CODE",
            },
          ],
          entityRanges: [],
          data: {},
        },
        {
          key: "4hh5r",
          text: "",
          type: "CODE",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    },
    id: uuid(),
  };
};

export const generateEditorStateFromRawContent = (
  rawContent: RawDraftContentState
) => {
  return EditorState.createWithContent(convertFromRaw(rawContent));
};
