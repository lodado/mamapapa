import { toggleMark } from "prosemirror-commands";
import { MarkType } from "prosemirror-model";
import { EditorState, TextSelection } from "prosemirror-state";

export const setMark = (state: EditorState, mark: MarkType) => {
  let tr = state.tr;
  tr.setSelection(TextSelection.create(state.doc, 1, 4)); // Simulating text selection from index 1 to 4
  const newState = state.apply(tr);

  // Dispatch transaction to apply highlight mark using toggleMark
  const dispatch = (transaction: any) => {
    tr = transaction;
  };

  toggleMark(mark)(newState, dispatch);

  // Apply the new transaction after toggleMark
  const finalState = newState.apply(tr);

  return finalState;
};
