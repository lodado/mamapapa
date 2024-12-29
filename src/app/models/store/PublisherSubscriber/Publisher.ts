import { all } from "redux-saga/effects";

import { pubsubManager } from "@/shared";

export function* handlePublishMessage(action: { type: string; payload: any }) {
  try {
    const publisher = pubsubManager.publish(action);

    if (publisher) {
      yield all(publisher.map((callback) => callback(action.payload)));
    }
  } catch (e) {
    console.log(e, "error occured and rollback state");
  }
}
