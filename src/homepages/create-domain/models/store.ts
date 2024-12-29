"use client";

import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { useDispatch as _useDisPatch, useSelector as _useSelector } from "react-redux";

// Define the initial state type
export interface AlertDialogState {
  isVisible: boolean;
  canSubmitForm: boolean;
}

// Create a slice for AlertDialog visibility
export const alertDialogSlice = createSlice({
  name: "alertDialog",
  initialState: { isVisible: false, canSubmitForm: false } as AlertDialogState,
  reducers: {
    ALERT_DIALOG_SET_VISIBLE: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },

    ALERT_SUBMIT_FORM_SET_VISIBLE: (state, action: PayloadAction<boolean>) => {
      state.canSubmitForm = action.payload;
    },
  },
});

export const { ALERT_DIALOG_SET_VISIBLE, ALERT_SUBMIT_FORM_SET_VISIBLE } = alertDialogSlice.actions;

export const configureAlertStore = configureStore({
  reducer: {
    alertDialog: alertDialogSlice.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({ thunk: false });
    return middlewares;
  },
});

export type AlertRootState = ReturnType<typeof configureAlertStore.getState>;
export type AlertDisPatch = typeof configureAlertStore.dispatch;

export const useAlertDispatch = _useDisPatch.withTypes<AlertDisPatch>();
export const useAlertSelector = _useSelector.withTypes<AlertRootState>();
