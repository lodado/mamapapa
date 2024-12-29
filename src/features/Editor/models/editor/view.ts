import { MarkdownParser, MarkdownSerializer } from "prosemirror-markdown";
import { Node as ProsemirrorNode, Schema } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

interface CreateViewParams {
  editor: HTMLElement;
  state: EditorState;
}

export const createView = ({ editor, state }: CreateViewParams): EditorView => {
  const view = new EditorView(editor, {
    state,

    dispatchTransaction(transaction: Transaction): void {
      const newState = view.state.apply(transaction);
      view.updateState(newState);
    },
  });

  return view;
};

/*

// NodeController에서 수집한 markdownSerializer 사용
export const myMarkdownSerializer = new MarkdownSerializer(
  NodeController.getMarkdownSerializer(),
  MarkController.getMarkdownSerializer()
);

export const createMarkdownView = ({ node }: { node: ProsemirrorNode }): string => {
  // ProseMirror 문서를 마크다운으로 변환
  const markdown = myMarkdownSerializer.serialize(node);

  return markdown;
};

/* TODO - 홀리;
  커스텀 파서를 직접 구현해야함 

  https://tilnote.io/pages/61d9811d9d70a7c3a37012e6

export const parseMarkdown = ({ schema, string }: { string: string; schema: Schema }) => {
  const { paragraph } = NodeController.getMarkdownParser();
  const { strong, highlight } = MarkController.getMarkdownParser();

  return new MarkdownParser(schema, generateMarkdownParser(), {
    text: { node: "text" },

    paragraph,

    highlight,
    strong,
  }).parse(string);
};
*/
