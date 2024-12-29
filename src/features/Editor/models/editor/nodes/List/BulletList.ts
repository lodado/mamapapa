import { setBlockType, wrapIn } from 'prosemirror-commands'
import { wrappingInputRule } from 'prosemirror-inputrules'
import { Node as ProsemirrorNode, NodeRange, NodeSpec, NodeType, Schema } from 'prosemirror-model'
import { liftListItem, sinkListItem, splitListItem, wrapInList } from 'prosemirror-schema-list'
import { EditorState, Transaction } from 'prosemirror-state'

import BaseNode from '../BaseNode'
import Paragraph from '../Paragraph'
import { exit } from '../utils'

export default class BulletList extends BaseNode {
  paragraph: Paragraph

  constructor({ paragraph }: { paragraph: Paragraph }) {
    super()
    this.paragraph = paragraph
  }

  get name(): string {
    return 'bulletList'
  }

  get createSchema(): NodeSpec {
    return {
      content: 'block*',
      group: 'ul',
      defining: true,
      parseDOM: [{ tag: 'li' }],
      toDOM: () => ['li', 0],
    }
  }

  EnterToEscapeList = (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { selection } = state
    const { $head, empty } = selection
    if (!empty) return false

    if ($head.parent.type === this.type && $head.parentOffset === $head.parent.content.size) {
      return exit(this.type)(state, dispatch)
    }

    return splitListItem(this.type)(state, dispatch)
  }

  keys() {
    return {
      Enter: this.EnterToEscapeList,
    }
  }
}
