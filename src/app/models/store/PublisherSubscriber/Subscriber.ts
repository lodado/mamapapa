import { call } from "redux-saga/effects";

function* subscribeToPublishMessages() {
  // yield call(publishLoginActions);
}

export function* setupSubscriptions() {
  yield call(subscribeToPublishMessages);
}
