import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LinkDialogState {
  isOpen: boolean;
}

const initialState: LinkDialogState = {
  isOpen: false,
};

const LinkDialogSlice = createSlice({
  name: "LinkDialog-slice",
  initialState,
  reducers: {
    RESET_EDITOR_LINK_DIALOG: () => {
      return initialState;
    },

    EDITOR_LINK_DIALOG_OPEN: (state) => {
      state.isOpen = true;
    },
    EDITOR_LINK_DIALOG_CLOSE: (state) => {
      state.isOpen = false;
    },
  },
});

export const { RESET_EDITOR_LINK_DIALOG,  EDITOR_LINK_DIALOG_OPEN, EDITOR_LINK_DIALOG_CLOSE } = LinkDialogSlice.actions;
export default LinkDialogSlice;
 