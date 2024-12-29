import { wrapIn } from 'prosemirror-commands'
import { NodeSpec, NodeType, Schema } from 'prosemirror-model'
import { Command, Plugin, TextSelection } from 'prosemirror-state'

import BaseNode from './BaseNode'

const INDENT = 2

export default class Indent extends BaseNode {
  get name() {
    return 'indent'
  }

  get createSchema(): NodeSpec {
    return {
      content: "block*",
      group: "block",
      attrs: {
        indent: { default: INDENT },
      },
      parseDOM: [
        {
          tag: "div",
          getAttrs: (dom) => ({
            indent: Number(dom.style.paddingLeft ?? 0) > 0 ? parseInt(dom.style.paddingLeft, 10) / 2 : 0,
          }),
        },
      ],
      toDOM: (node) => ["div", { style: `padding-left: ${node.attrs.indent}em` }, 0],
    };
  }

  wrapIndentCommand(): Command {
    return (state, dispatch) => {
      const { schema, selection } = state
      const { from, to } = selection
      let { tr } = state

      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type === this.type) {
          const currentIndent = INDENT
          tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: currentIndent })
        }
      })

      const divType = this.type
      if (!divType) return false

      if (dispatch) {
        tr = tr.wrap(selection.$from.blockRange(selection.$to)!, [
          { type: divType, attrs: { indent: tr.selection.$from.nodeAfter?.attrs.indent || INDENT } },
        ])
        dispatch(tr)
      }

      return true
    }
  }

  unindentCommand(): Command {
    return (state, dispatch) => {
      const { selection } = state
      const { $from } = selection
      const parentNode = $from.node(-1)
      const arr: any[] = []

      if (parentNode.type === this.type) {
        const parentPos = $from.before(-1)
        const newPos = parentPos

        let { tr } = state

        // 부모 노드에서 현재 노드를 삭제
        tr = tr.delete($from.start(-1), $from.end(-1))

        // 모든 자식 노드를 새로운 위치에 삽입
        parentNode.content.forEach((child, offset) => {
          arr.push(child)
        })

        arr.reverse().forEach((child) => {
          tr = tr.insert(newPos, child)
        })

        const newCursorPos = Math.max(0, $from.end() - 1)
        tr = tr.setSelection(TextSelection.create(tr.doc, newCursorPos))

        if (dispatch) {
          dispatch(tr)
        }
      }

      return true
    }
  }

  keys(): Record<string, Command> {
    return {
      Tab: this.wrapIndentCommand(),
      'Shift-Tab': this.unindentCommand(),
    }
  }
}
