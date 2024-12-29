import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

const pageLoadingSlice = createSlice({
  name: "pageLoading",
  initialState,
  reducers: {
    SET_PAGE_LOADING(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { SET_PAGE_LOADING } = pageLoadingSlice.actions;

export default pageLoadingSlice;
