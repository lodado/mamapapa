 
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Position } from "./type";
import { useEditorSelector } from "@/features/Editor/hooks";

interface BlockCreateButtonState {
  position: Position;
  isOpen: boolean;
}

const initialState: BlockCreateButtonState = {
  position: { x: 0, y: 0 },
  isOpen: false,
};

const blockCreateButtonSlice = createSlice({
  name: "blockCreateButton-slice",
  initialState,
  reducers: {
    RESET_BLOCK_CREATE: () => {
      return initialState;
    },

    SHOW_BLOCK_CREATE_BUTTON(state, action: PayloadAction<Position>) {
      const { y } = action.payload;
      state.position = { x: 5, y: y - 10 };
      state.isOpen = true;
    },
    DISAPPEAR_BLOCK_CREATE_BUTTON(state) {
      state.isOpen = false;
    },
  },
});

export const { RESET_BLOCK_CREATE, SHOW_BLOCK_CREATE_BUTTON, DISAPPEAR_BLOCK_CREATE_BUTTON } =
  blockCreateButtonSlice.actions;
export default blockCreateButtonSlice;
