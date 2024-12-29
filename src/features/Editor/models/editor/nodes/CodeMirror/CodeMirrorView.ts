/*
 
import { defaultKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { drawSelection, EditorView as CodeMirror, keymap as cmKeymap, ViewUpdate } from '@codemirror/view'
import { exitCode } from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { Node as ProsemirrorNode, Schema } from 'prosemirror-model'
import { Command, EditorState, Selection, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'

import Paragraph from '../Paragraph'

export default class CodeMirrorView implements NodeView {
  paragraph: Paragraph
  node: ProsemirrorNode
  view: EditorView
  schema: Schema
  getPos: () => number
  cm: CodeMirror
  dom: HTMLElement
  updating: boolean

  private exit = (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    if (!dispatch) return false

    const nodeType = this.paragraph.type
    const newNode = nodeType.createAndFill()

    if (newNode) {
      // 트랜잭션 생성
      const { tr } = state
      // 문서의 맨 끝 위치 구하기
      const endPos = state.doc.content.size

      // 트랜잭션에 노드 추가
      tr.insert(endPos, newNode)
      // 추가한 노드로 커서 이동
      tr.setSelection(TextSelection.near(tr.doc.resolve(endPos)))
      // 트랜잭션 적용
      dispatch(tr)

      return true
    }

    return false
  }

  constructor(node: ProsemirrorNode, view: EditorView, getPos: () => number | undefined, paragraph: Paragraph) {
    // Store for later
    this.node = node
    this.view = view
    this.schema = view.state.schema
    this.paragraph = paragraph

    this.getPos = () => {
      return getPos() ?? 0
    }

    // Create a CodeMirror instance
    this.cm = new CodeMirror({
      doc: this.node.textContent,
      extensions: [
        cmKeymap.of([...this.codeMirrorKeymap(), ...defaultKeymap]),
        drawSelection(),
        syntaxHighlighting(defaultHighlightStyle),
        javascript(),
        CodeMirror.updateListener.of((update) => this.forwardUpdate(update)),
      ],
    })

    // The editor's outer node is our DOM representation
    this.dom = this.cm.dom

    // This flag is used to avoid an update loop between the outer and
    // inner editor
    this.updating = false
  }

  isEmpty() {
    return this.cm.state.doc.length === 0
  }

  forwardUpdate(update: ViewUpdate) {
    if (this.updating) return // 업데이트 루프 방지

    // CodeMirror의 포커스 상태를 확인하고, 변경 사항이 있을 경우만 처리
    if (update.docChanged && this.cm.hasFocus) {
      const newText = this.cm.state.doc.toString() // CodeMirror의 현재 텍스트
      const pos = this.getPos()

      // ProseMirror 노드의 현재 텍스트와 비교
      if (newText !== this.node.textContent) {
        // ProseMirror 트랜잭션 생성
        const { tr } = this.view.state
        const nodePos = pos + 1 // 노드의 시작 위치
        const nodeEnd = nodePos + this.node.nodeSize - 2 // 노드의 끝 위치

        // 노드의 텍스트를 새로운 텍스트로 교체
        tr.replaceWith(nodePos, nodeEnd, this.schema.text(newText))
        this.view.dispatch(tr) // 트랜잭션 적용
      }
    }
  }

  setSelection(anchor: number, head: number) {
    this.cm.focus()
    this.updating = true
    this.cm.dispatch({ selection: { anchor, head } })
    this.updating = false
  }

  maybeEscape(unit: 'line' | 'char', dir: number) {
    const { state } = this.cm
    let { main } = state.selection
    if (!main.empty) return false
    // @ts-ignore
    if (unit === 'line') main = state.doc.lineAt(main.head)
    if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false
    const targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize)
    const selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
    const tr = this.view.state.tr.setSelection(selection).scrollIntoView()
    this.view.dispatch(tr)
    this.view.focus()

    return true
  }

  codeMirrorKeymap() {
    const { view } = this

    return [
      { key: 'ArrowUp', run: () => this.maybeEscape('line', -1) },
      { key: 'ArrowLeft', run: () => this.maybeEscape('char', -1) },
      {
        key: 'ArrowDown',
        run: () => {
          if (!this.exit(view.state, view.dispatch)) return false

          return this.maybeEscape('line', 1)
        },
      },
      { key: 'ArrowRight', run: () => this.maybeEscape('char', 1) },
      {
        key: 'Ctrl-Enter',
        run: () => {
          if (!exitCode(view.state, view.dispatch)) return false
          view.focus()
          return true
        },
      },
      {
        key: 'Esc',
        run: () => {
          if (!exitCode(view.state, view.dispatch)) return false
          view.focus()
          return true
        },
      },
      {
        key: 'Tab',
        run: () => {
          return true
        },
      },
      {
        key: 'Shift-Tab',
        run: () => {
          return true
        },
      },
      {
        key: 'Shift-Enter',
        mac: 'Cmd-z',
        run: () => {
          return true
        },
      },
      { key: 'Ctrl-z', mac: 'Cmd-z', run: () => undo(view.state, view.dispatch) },
      { key: 'Shift-Ctrl-z', mac: 'Shift-Cmd-z', run: () => redo(view.state, view.dispatch) },
      { key: 'Ctrl-y', mac: 'Cmd-y', run: () => redo(view.state, view.dispatch) },
    ]
  }

  update(node: ProsemirrorNode) {
    if (node.type !== this.node.type) return false
    this.node = node
    if (this.updating) return true
    const newText = node.textContent
    const curText = this.cm.state.doc.toString()
    if (newText != curText) {
      let start = 0
      let curEnd = curText.length
      let newEnd = newText.length
      while (start < curEnd && curText.charCodeAt(start) == newText.charCodeAt(start)) {
        start += 1
      }
      while (curEnd > start && newEnd > start && curText.charCodeAt(curEnd - 1) == newText.charCodeAt(newEnd - 1)) {
        curEnd -= 1
        newEnd -= 1
      }
      this.updating = true
      this.cm.dispatch({
        changes: {
          from: start,
          to: curEnd,
          insert: newText.slice(start, newEnd),
        },
      })
      this.updating = false
    }
    return true
  }

  arrowHandler(dir: 'left' | 'right' | 'up' | 'down'): Command {
    return (state: EditorState, dispatch: ((tr: Transaction) => void) | undefined, view?: EditorView) => {
      if (dispatch && state.selection.empty && view?.endOfTextblock(dir)) {
        const side = dir === 'left' || dir === 'up' ? -1 : 1
        const { $head } = state.selection
        const nextPos = Selection.near(state.doc.resolve(side > 0 ? $head.after() : $head.before()), side)
        if (nextPos.$head && nextPos.$head.parent.type.name === 'code_block') {
          dispatch(state.tr.setSelection(nextPos))
          return true
        }
      }
      return false
    }
  }

  arrowHandlers = () =>
    keymap({
      ArrowLeft: this.arrowHandler('left'),
      ArrowRight: this.arrowHandler('right'),
      ArrowUp: this.arrowHandler('up'),
      ArrowDown: this.arrowHandler('down'),
    })
}

*/
