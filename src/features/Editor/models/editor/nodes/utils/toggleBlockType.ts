import { NodeType, Schema } from 'prosemirror-model'
import { Command, EditorState, TextSelection, Transaction } from 'prosemirror-state'

function toggleBlockType(nodeType: NodeType, toggleType: NodeType): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { $from, $to } = state.selection
    const range = $from.blockRange($to)
    if (!range) return false

    const targetType = state.schema.nodes[nodeType.name]
    const targetToggleType = state.schema.nodes[toggleType.name]

    if (!targetType || !targetToggleType) return false

    const isActive = state.selection.$from.parent.hasMarkup(targetType)
    if (dispatch) {
      const tr = state.tr.setBlockType(range.start, range.end, isActive ? targetToggleType : targetType)
      dispatch(tr.scrollIntoView())
    }

    return true
  }
}

export default toggleBlockType
