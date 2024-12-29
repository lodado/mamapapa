import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DropdownPosition } from "./type";

interface DropdownState {
  position: DropdownPosition;
  isOpen: boolean;
}

const initialState: DropdownState = {
  position: { x: 0, y: 0 },
  isOpen: false,
};

const dropdownSlice = createSlice({
  name: "dropdown-slice",
  initialState,
  reducers: {
    RESET_EDITOR_DROPDOWN: () => {
      return initialState;
    },

    EDITOR_DROPDOWN_OPEN: (state, action: PayloadAction<DropdownPosition>) => {
      state.position = action.payload;
      state.isOpen = true;
    },
    EDITOR_DROPDOWN_CLOSE: (state) => {
      state.isOpen = false;
    },
  },
});

export const { RESET_EDITOR_DROPDOWN, EDITOR_DROPDOWN_OPEN, EDITOR_DROPDOWN_CLOSE } = dropdownSlice.actions;
export default dropdownSlice;
 