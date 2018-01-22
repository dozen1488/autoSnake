import { put } from "redux-saga/effects";

import Requester from "../managers/requester";
import KeyboardListener from "../managers/keyboardListener";
import * as actions from "../actions/actions";
import { x, y, radiusOfVisionForNetwork } from "../sharedConstants/configuration.json";

export default function* initFunction(dispatch, radiusOfVision) {
    radiusOfVision = (radiusOfVision) ? radiusOfVision : radiusOfVisionForNetwork;
    yield put(actions.initStore(x, y, radiusOfVision));
    try {
        const networkJSON = yield Requester.receiveNetwork(radiusOfVision);
        yield put(actions.networkReady(networkJSON, radiusOfVision));
    } catch (error) {
        console.log("network retrieve failed");
    }
    KeyboardListener.stopListening();
    KeyboardListener.startListening((...args) => dispatch(actions.keyPressed(...args)));
}
