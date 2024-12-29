// editorSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorNode } from "../core";

interface EditorState {
  content: EditorNode | null;
}

const initialState: EditorState = {
  content: null,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    SET_EDITOR_CONTENT(state, action: PayloadAction<EditorNode>) {
      // @ts-ignore nonserializable data 넣기 위해 ignore
      state.content = action.payload;
    },
  },
});

export const { SET_EDITOR_CONTENT } = editorSlice.actions;
export default editorSlice;
