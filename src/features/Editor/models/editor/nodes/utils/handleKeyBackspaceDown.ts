import { Node } from 'prosemirror-model'
import { EditorState, PluginKey, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { KeyboardEvent } from 'react'

interface HandleKeyBackspaceDownProps {
  state: EditorState
  dispatch?: (tr: Transaction) => void
}

export const handleKeyBackspaceDown = ({ state, dispatch }: HandleKeyBackspaceDownProps): boolean => {
  const { selection } = state
  const { $from, empty } = selection

  if (empty) {
    const { nodeBefore } = $from
    const node = $from.node() as Node

    if (node && node.textContent === '' && node.type.name === 'codeMirror') {
      const tr = state.tr.delete(Math.max($from.pos - node.nodeSize, 0), $from.pos)
      dispatch?.(tr)
      return true
    }
  }

  return false
}
