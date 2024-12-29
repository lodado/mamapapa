import { InputRule, inputRules } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { NodeSpec, NodeType, Schema } from 'prosemirror-model'
import { Command, Plugin, TextSelection } from 'prosemirror-state'

import BaseNode from './BaseNode'
import Paragraph from './Paragraph'
import { handleKeyBackspaceDown, toggleBlockType } from './utils'

export default class Code extends BaseNode {
  paragraph: Paragraph

  constructor({ paragraph }: { paragraph: Paragraph }) {
    super()
    this.paragraph = paragraph
  }

  get name(): string {
    return 'code_block'
  }

  get createSchema(): NodeSpec {
    return {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
      toDOM() {
        return ['pre', ['code', 0]]
      },
    }
  }

  inputRules(): InputRule[] {
    return [
      new InputRule(/^```$/, (state, match, start, end) => {
        let tr = state.tr.delete(start, end)
        const { schema } = state
        const node = schema.nodes[this.name].create()
        tr = tr.replaceSelectionWith(node)
        return tr.setSelection(TextSelection.create(tr.doc, start + 1))
      }),
    ];
  }

  keys(): Record<string, Command> {
    return {
      'Shift-Ctrl-\\': toggleBlockType(this.type, this.paragraph.type),
      Backspace: (state, dispatch) => {
        return handleKeyBackspaceDown({ state, dispatch })
      },
    }
  }

  commands() {
    return (attrs: any) => toggleBlockType(this.type, this.paragraph.type)
  }
}
