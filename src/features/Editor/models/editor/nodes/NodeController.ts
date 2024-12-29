/* eslint-disable no-param-reassign */
import { NodeSpec, Schema } from "prosemirror-model";

import BaseNode from "./BaseNode";
import Break from "./Break";
import Heading from "./Heading";
import ProseImage from "./Image/Image";
import Paragraph from "./Paragraph";
import { MarkdownSerializerState } from "prosemirror-markdown";
import { ProseMirrorNode } from "../types";
import { EditorReduxStore } from "../../store";

/**
 * paragraph를 가장 먼저 안 읽으면 화면 터짐
 */
const atomics = {
  paragraph: new Paragraph(),

  heading: new Heading(),
  break: new Break(),
};

const molecules = {
  proseImage: new ProseImage({ paragraph: atomics.paragraph }),

  // splitScreen: new SplitScreen({ paragraph: atomics.paragraph }),

  // code: new Code({ paragraph: atomics.paragraph }),
  // codeMirror: new CodeMirror({ paragraph: atomics.paragraph }),

  // BulletList: new BulletList({ paragraph: atomics.paragraph }),
};

const Organisms = {
  /* 
  UnorderedList: new UnorderedList({
    paragraph: atomics.paragraph,
    bulletList: molecules.BulletList,
  }),
  */
};

// TO DO - 주석들 구현
// @ts-ignore
const NODE_REGISTER: BaseNode[] = [
  ...Object.values(atomics),
  ...Object.values(molecules),
  ...Object.values(Organisms),
].reverse();

export class _NodeController {
  nodes = NODE_REGISTER;
  store: typeof EditorReduxStore;

  constructor(store: typeof EditorReduxStore) {
    this.store = store;
  }

  getPlugins(schema: Schema) {
    return this.nodes.flatMap((node) => {
      const type = schema.nodes[node.name];

      node.setMetadata({ type, schema });
      return node.plugins();
    });
  }

  getNodes() {
    return this.nodes.reduce((obj: { [key in string]: NodeSpec }, node) => {
      obj[node.name] = node.createSchema;
      return obj;
    }, {});
  }

  getMarkdownSerializer() {
    return {
      text(state: MarkdownSerializerState, node: ProseMirrorNode) {
        if (node.text) state.text(node.text);
      },

      ...this.nodes.reduce(
        (obj: Record<string, (state: MarkdownSerializerState, node: ProseMirrorNode) => void>, node) => {
          obj[node.name] = node.markdownSerializer()[node.name];

          return obj;
        },
        {}
      ),
    };
  }

  getMarkdownParser() {
    return {
      ...this.nodes.reduce((obj: Record<string, { block: string }>, node) => {
        obj[node.name] = node.parseMarkdown();

        return obj;
      }, {}),
    };
  }
}
