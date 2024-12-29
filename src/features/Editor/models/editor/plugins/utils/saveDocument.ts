import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

export function saveDocument(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView) {
  const { doc } = view!.state
  const json = JSON.stringify(doc.toJSON())

  /** TO DO - 로컬스토리지 용량 제한이 있으므로 추후 변경 */
  // 여기서 서버로 데이터를 전송하거나 파일로 저장할 수 있습니다.

  localStorage.setItem('prosemirror-document', json)

  console.log(json, 'saved')

  return true
}
