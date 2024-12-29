import { InputRule, inputRules } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { DOMOutputSpec, MarkSpec, MarkType, Schema } from 'prosemirror-model'
import { Command, EditorState, Plugin } from 'prosemirror-state'

import BaseNode from './BaseNode'

// <br> 마크 정의
export default class Break extends BaseNode {
  get name(): string {
    return 'br'
  }

  get createSchema() {
    return {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM: () => ['br'] satisfies DOMOutputSpec,
    }
  }

  keys(): Record<string, Command> {
    return {
      'Shift-Enter': (state, dispatch) => {
        const hardBreak = this.type
        if (dispatch) {
          dispatch(state.tr.replaceSelectionWith(hardBreak.create()).scrollIntoView())
        }
        return false
      },
    }
  }
}
