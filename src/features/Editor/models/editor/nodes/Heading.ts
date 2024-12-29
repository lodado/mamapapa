import { inputRules, textblockTypeInputRule } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { DOMOutputSpec, Node, NodeSpec, NodeType, Schema } from 'prosemirror-model'
import { Command, EditorState, Plugin, Selection, Transaction } from 'prosemirror-state'

import BaseNode from './BaseNode'

export default class Heading extends BaseNode {
  className = 'heading-name'

  get name() {
    return 'heading'
  }

  private toggleHeading() {
    return (state: EditorState, dispatch: (tr: Transaction) => void = () => {}) => {
      const { $from, $to } = state.selection

      const range = $from.blockRange($to)
      if (!range) return false

      const node = state.doc.nodeAt(range.start)!

      if (node && node.type === this.type) {
        const collapsed = !node.attrs.collapsed

        if (dispatch) {
          dispatch(
            state.tr.setNodeMarkup(range.start, undefined, {
              ...node.attrs,
              collapsed,
            }),
          )
        }
        return true
      }
      return false
    }
  }

  get defaultOptions() {
    return {
      levels: [1, 2, 3, 4],
      collapsed: false,
    }
  }

  get createSchema() {
    return {
      attrs: {
        level: {
          default: 1,
        },
        collapsed: { default: false },
      },
      content: "(inline|text)*",
      group: "block",
      defining: true,
      parseDOM: this.defaultOptions.levels.map((level) => ({
        tag: `h${level}`,
        attrs: () => {
          return { level, collapsed: this.defaultOptions.collapsed };
        },
      })),
      toDOM: (node: Node) =>
        [
          `h${node.attrs.level}`,
          {
            class: `${this.defaultClassName()} heading-0${node.attrs.level}`,
            "data-collapsed": node.attrs.collapsed ? "true" : "false",
          },
          0,
        ] satisfies DOMOutputSpec,
    };
  }

  commands() {
    return (attrs: { level: number; collapsed: boolean }) =>
      (state: EditorState, dispatch: (tr: Transaction) => void = () => {}) => {
        const { $from, $to } = state.selection

        if (dispatch) {
          dispatch(state.tr.setBlockType($from.pos, $to.pos, this.type, attrs))
        }

        return true
      }
  }

  inputRules() {
    return this.defaultOptions.levels.map((level: number) =>
      textblockTypeInputRule(new RegExp(`^(#{1,${level}})\\s$`), this.type, () => ({
        level,
        collapsed: this.defaultOptions.collapsed,
      })),
    )
  }

  keys = () => {
    return this.defaultOptions.levels.reduce(
      (items, level) => ({
        ...items,
        [`Shift-Ctrl-${level}`]: this.commands()({ level, collapsed: this.defaultOptions.collapsed }),
        'Shift-Ctrl-h': this.toggleHeading(),
      }),
      {},
    )
  }

  plugins() {
    return super.plugins()
  }
}
