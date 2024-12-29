import { NodeType } from 'prosemirror-model'
import { EditorState, TextSelection, Transaction } from 'prosemirror-state'

export const exit =
  (node: NodeType, transaction?: Transaction, pos?: number) =>
  (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    if (!dispatch) return false

    const nodeType = node
    const newNode = nodeType.createAndFill()

    if (newNode) {
      // 트랜잭션 생성
      let { tr } = state

      if (transaction) tr = transaction

      const endPos = pos ?? state.doc.content.size

      tr.insert(endPos, newNode)
      tr.setSelection(TextSelection.near(tr.doc.resolve(endPos)))

      dispatch(tr)

      return true
    }

    return false
  }
