import { Mark } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

export function getMarksAtRange(state: EditorState, from: number, to: number) {
  let marks: Mark[] = []

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText) return true // 텍스트 노드가 아니면 건너뛰기

    // 현재 텍스트 노드에 적용된 마크 추가
    marks = marks.concat(node.marks)
    return false // 하위 노드 탐색 중지
  })

  return marks
}

export function uniqueMarks(marks: Mark[]) {
  const unique = new Map()
  marks.forEach((mark) => {
    unique.set(mark.type.name, mark)
  })

  return Array.from(unique.entries()).map(([key, value]) => value)
}
