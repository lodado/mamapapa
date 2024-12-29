import { call, takeLatest } from "redux-saga/effects";

import { handlePublishMessage } from "./Publisher";
import { setupSubscriptions } from "./Subscriber";

export default function* rootSaga() {
  yield call(setupSubscriptions);
  yield takeLatest("*", handlePublishMessage);
}
