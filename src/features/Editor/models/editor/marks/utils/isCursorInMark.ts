import { EditorState } from 'prosemirror-state'

// 커서가 특정 마크 안에 있는지 확인하는 함수

export function isCursorInMark(state: EditorState): boolean {
  const { marks } = state.schema

  const { from, empty } = state.selection
  if (!empty) return false // 선택 영역이 비어있지 않다면 false

  const $from = state.doc.resolve(from)

  return Object.entries(marks).some(([markName, markType]) => {
    return markType.isInSet($from.marks())
  })
}
