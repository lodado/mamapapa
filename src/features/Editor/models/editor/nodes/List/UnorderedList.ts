import { setBlockType, wrapIn } from 'prosemirror-commands'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { Node as ProsemirrorNode, NodeRange, NodeSpec, NodeType, Schema } from 'prosemirror-model'
import { liftListItem, sinkListItem, splitListItem, wrapInList } from 'prosemirror-schema-list'
import { Command, EditorState, Transaction } from 'prosemirror-state'
import { findWrapping } from 'prosemirror-transform'
import { findParentNode } from 'prosemirror-utils'

import BaseNode from '../BaseNode'
import Indent from '../Indent'
import Paragraph from '../Paragraph'
import { chainTransactions } from '../utils/chainTransaction'
import clearNodes from '../utils/clearNode'
import BulletList from './BulletList'

function isList(node: ProsemirrorNode, schema: Schema) {
  return node.type === schema.nodes.ul || node.type === schema.nodes.bulletList
}

export default class UnorderedList extends BaseNode {
  paragraph: Paragraph;
  bulletList: BulletList;

  constructor({ paragraph, bulletList }: { paragraph: Paragraph; bulletList: BulletList }) {
    super();
    this.paragraph = paragraph;
    this.bulletList = bulletList;
  }

  get name(): string {
    return "ul";
  }

  get createSchema(): NodeSpec {
    return {
      content: `${this.bulletList.name}+`,
      group: "block",
      parseDOM: [{ tag: "ul" }],
      toDOM: () => ["ul", 0],
    };
  }

  protected toggleList(listType: NodeType, itemType: NodeType): Command {
    return (state, dispatch) => {
      const { schema, selection } = state;
      const { $from, $to } = selection;
      const range = $from.blockRange($to);
      const { tr } = state;

      if (!range) {
        return false;
      }

      const parentList = findParentNode((node) => isList(node, schema))(selection);

      if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
        if (parentList.node.type === listType) {
          return liftListItem(itemType)(state, dispatch);
        }

        if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
          tr.setNodeMarkup(parentList.pos, listType);

          dispatch?.(tr);
          return false;
        }
      }

      const canWrapInList = wrapInList(listType)(state);

      if (canWrapInList) {
        return wrapInList(listType)(state, dispatch);
      }

      return chainTransactions(clearNodes(), wrapInList(listType))(state, dispatch);
    };
  }

  handleTabKey = (state: EditorState, dispatch: (tr: Transaction) => void) => {
    return false;
    // return true
  };

  inputRules() {
    return [wrappingInputRule(/^\s*([-+*])\s$/, this.type)];
  }

  keys() {
    return {
      "Ctrl-Shift-8": this.toggleList(this.type, this.bulletList.type),
      Tab: this.handleTabKey,
    };
  }
}
