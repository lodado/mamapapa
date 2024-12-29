import { EditorReduxStore } from "../models";
import { useDispatch as _useDisPatch, useSelector as _useSelector } from "react-redux";

export type EditorRootState = ReturnType<typeof EditorReduxStore.getState>;
export type EditorDispatch = typeof EditorReduxStore.dispatch;

export const useEditorDispatch = _useDisPatch.withTypes<EditorDispatch>();
export const useEditorSelector = _useSelector.withTypes<EditorRootState>();
