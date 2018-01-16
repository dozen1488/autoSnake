import { put } from "redux-saga/effects";

import Requester from "../managers/requester";
import * as actions from "../actions/actions";
import { x, y, radiusOfVisionForNetwork } from "../sharedConstants/configuration.json";

export default function* initFunction() {

    yield put(actions.initStore(x, y, radiusOfVisionForNetwork));
    try {
        const networkJSON = yield Requester.receiveNetwork();
        yield put(actions.networkReady(networkJSON));
    } catch (error) {
        console.log("network retrieve failed");
    }
}
