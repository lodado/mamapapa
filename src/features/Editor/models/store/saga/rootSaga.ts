import { all, takeEvery } from "redux-saga/effects";
import { RESET_EDITOR_STATUS } from "./action";
import { RESET_DRAG_BUTTON } from "@/features/Editor/ui/components/DragButton/model";
import { RESET_BLOCK_CREATE } from "@/features/Editor/ui/components/BlockCreateButton/model";
import { RESET_EDITOR_DROPDOWN } from "@/features/Editor/ui/components/Dropdown/model";
import { RESET_EDITOR_MARK_TOOLTIP } from "@/features/Editor/ui/components/MarkTooltip/model";

const resetEditorStatusSaga = function* () {
  yield all([RESET_DRAG_BUTTON, RESET_BLOCK_CREATE, RESET_EDITOR_DROPDOWN, RESET_EDITOR_MARK_TOOLTIP]);
};

function* watchResetEditorStatus() {
  yield takeEvery(RESET_EDITOR_STATUS, resetEditorStatusSaga);
}

export function* rootSaga() {
  yield all([watchResetEditorStatus()]);
}
