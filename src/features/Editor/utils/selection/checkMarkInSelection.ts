import { EditorState } from "prosemirror-state";
import { MarkType } from "prosemirror-model";

// 상수 정의
export const MARK_ALL_PRESENT = "FULL_SELECTION";
export const MARK_NONE_PRESENT = "NOT_SELECTION";
export const MARK_PARTIALLY_PRESENT = "PARTIAL_SELECTION";

export function checkMarkInSelection(
  state: EditorState,
  markType: MarkType
): typeof MARK_ALL_PRESENT | typeof MARK_PARTIALLY_PRESENT | typeof MARK_NONE_PRESENT {
  const { from, to } = state.selection;
  let hasMark = false;
  let hasNoMark = false;

  state.doc.nodesBetween(from, to, (node) => {
    // 노드가 텍스트인 경우에만 mark를 확인
    if (node.isText) {
      const marks = node.marks.map((mark) => mark.type);
      const isMarkPresent = marks.includes(markType);

      if (isMarkPresent) {
        hasMark = true;
      } else {
        hasNoMark = true;
      }
    }
  });

  if (hasMark && hasNoMark) {
    return MARK_PARTIALLY_PRESENT; // 일부분만 mark로 감싸져 있음
  } else if (hasMark) {
    return MARK_ALL_PRESENT; // 전부 mark로 감싸져 있음
  } else {
    return MARK_NONE_PRESENT; // 아예 mark가 없음
  }
}
