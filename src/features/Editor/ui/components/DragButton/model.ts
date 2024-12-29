import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node as ProseMirrorNode, ResolvedPos } from "prosemirror-model";
import { Position } from "./type";
import { useEditorSelector } from "@/features/Editor/hooks";
 
interface DragButtonState {
  position: Position;
  targetPosition: number | null;
  dragFlag: boolean;
  isOpen: boolean;
}

const initialState: DragButtonState = {
  position: { x: 0, y: 0 },
  targetPosition: null,
  dragFlag: false,
  isOpen: false,
};

const dragButtonSlice = createSlice({
  name: "dragButton-slice",
  initialState,
  reducers: {
    RESET_DRAG_BUTTON: () => {
      return initialState;
    },

    DRAG_BUTTON_SET_DRAG_FLAG(state, action: PayloadAction<boolean>) {
      state.dragFlag = action.payload;
    },
    DRAG_BUTTON_START(state, action: PayloadAction<{ x: number; y: number; targetPosition: number }>) {
      if (state.dragFlag) return;
      const { x, y, targetPosition } = action.payload;
      state.position = { x: x + 5, y: y - 10 };

      state.targetPosition = targetPosition;
      state.isOpen = true;
    },
    DRAG_BUTTON_END(state) {
      if (state.dragFlag) return;
      state.isOpen = false;
    },
  },
});

export const { RESET_DRAG_BUTTON, DRAG_BUTTON_SET_DRAG_FLAG, DRAG_BUTTON_START, DRAG_BUTTON_END } =
  dragButtonSlice.actions;
export default dragButtonSlice;
