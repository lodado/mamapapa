import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { useDispatch as _useDisPatch, useSelector as _useSelector } from "react-redux";
import dropdownSlice from "../../ui/components/Dropdown/model";
import dragButtonSlice from "../../ui/components/DragButton/model";
import  blockCreateButtonSlice   from "../../ui/components/BlockCreateButton/model";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./saga";
import editorSlice from "./EditorContentSlice";
import markTooltipSlice from "../../ui/components/MarkTooltip/model";
import LinkDialogSlice from "../../ui/components/LinkDialog/model";

const sagaMiddleware = createSagaMiddleware();

export const createEditorReduxLocalStore = () => {
  const store = configureStore({
    reducer: {
      dropdown: dropdownSlice.reducer,
      dragButton: dragButtonSlice.reducer,
      blockCreateButton: blockCreateButtonSlice.reducer,
      editorContent: editorSlice.reducer,
      markToolTip: markTooltipSlice.reducer,
      linkDialog: LinkDialogSlice.reducer,
    },

    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware({
        thunk: false,
        serializableCheck: {
          ignoredPaths: ["editorContent"], // 직렬화 검사를 무시할 상태 경로
        },
      }).concat(sagaMiddleware);

      if (process.env.NODE_ENV === "development") {
        middlewares.concat(logger);
      }

      return middlewares;
    },
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const EditorReduxStore = createEditorReduxLocalStore();
