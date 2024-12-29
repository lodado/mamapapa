import { Fragment, NodeSpec, NodeType, Schema, Slice } from 'prosemirror-model'
import { EditorState, Plugin, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import BaseNode from './BaseNode'
import Paragraph from './Paragraph'

export default class SplitScreen extends BaseNode {
  paragraph: Paragraph

  constructor({ paragraph }: { paragraph: Paragraph }) {
    super()
    this.paragraph = paragraph
  }

  get name() {
    return 'splitScreen'
  }

  get createSchema(): NodeSpec {
    return {
      content: 'block+',
      group: 'block',
      defining: true,
      attrs: {
        orientation: { default: 'vertical' },
      },
      parseDOM: [
        {
          tag: 'div.split-screen',
          getAttrs: (dom) => ({ orientation: dom.className.includes('horizontal') ? 'horizontal' : 'vertical' }),
        },
      ],
      toDOM: (node) => {
        return [
          'div',
          { style: 'position: relative' },
          ['div', { class: `body-02-r split-screen ${node.attrs.orientation}` }, 0], // 콘텐츠 홀을 별도의 컨테이너에 넣음
        ]
      },
    }
  }

  private handleDrop = (view: EditorView, event: Event, slice: Slice, moved: boolean) => {
    // Check if more than one block is being dragged
    let blockCount = 0
    slice.content.forEach((node) => {
      if (node.isBlock) blockCount += 1
    })

    // Check if the drop target is a split_screen node
    // @ts-ignore
    const target = view.posAtCoords({ left: event.clientX, top: event.clientY })
    if (target) {
      const $target = view.state.doc.resolve(target.pos)

      let { depth } = $target

      while (depth > 0) {
        const targetNode = $target.node(depth)
        if (targetNode.type === this.type && blockCount > 1) {
          event.preventDefault()

          alert('only one block can be moved into split layout')
          return true
        }

        depth -= 1
      }
    }

    return false
  }

  private handlePaste = (view: EditorView, event: ClipboardEvent, slice: Slice) => {
    // Check if more than one block is being pasted
    let blockCount = 0
    slice.content.forEach((node) => {
      if (node.isBlock) blockCount += 1
    })

    // Check if the paste target is a split_screen node
    const { state } = view
    const { selection } = state
    const { $from } = selection

    let { depth } = $from

    while (depth > 0) {
      const targetNode = $from.node(depth)
      if (targetNode.type === this.type && blockCount > 1) {
        event.preventDefault()

        alert('only one block can be pasted into split layout')
        return true
      }

      depth -= 1
    }

    return false
  }

  private toggleSplitScreen = (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { selection, tr } = state
    const { from, to, $from } = selection

    const paragraph = this.paragraph.type

    const $pos = state.doc.resolve(from)
    const node = $pos.node($pos.depth) // 현재 노드
    const parentNode = $pos.node(-1)

    const { orientation } = parentNode.attrs
    const newOrientation = orientation === 'vertical' ? 'horizontal' : 'vertical'

    if (dispatch) {
      const { content } = node

      const firstHalf = content.cut(0, content.size)
      const secondHalf = content.cut(content.size, content.size)

      const splitNode = this.type.create({ orientation: newOrientation }, [
        paragraph.create({}, firstHalf),
        paragraph.create({}, secondHalf),
      ])
      tr.replaceRangeWith(from - $pos.parentOffset, to + node.nodeSize - $pos.parentOffset, splitNode)
      dispatch(tr)

      return true
    }

    return false
  }

  private handleEnterInterrupted = (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { selection, schema } = state
    const { $from } = selection

    let node = $from.node()
    let { depth } = $from

    while (depth > 0) {
      if (node.type.name === this.name) {
        if (dispatch) {
          const { br } = schema.nodes
          const tr = state.tr.replaceSelectionWith(br.create())
          dispatch(tr)
        }
        return true
      }
      depth -= 1
      node = $from.node(depth)
    }

    return false
  }

  private handleBackspace = (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { selection } = state
    const { $from } = selection

    const { pos } = $from

    const resolvedPos = state.doc.resolve(pos - 1)
    if (resolvedPos?.nodeBefore?.type === this.type) return true

    return false
  }

  keys() {
    return {
      'Ctrl-Shift-S': this.toggleSplitScreen,
      Enter: this.handleEnterInterrupted,
      Backspace: this.handleBackspace,
    }
  }

  plugins(): Plugin[] {
    return [
      ...super.plugins(),
      new Plugin({
        props: {
          handleDrop: this.handleDrop,
          handlePaste: this.handlePaste,
        },
      }),
    ]
  }
}
