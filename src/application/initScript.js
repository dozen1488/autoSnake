import * as actions from "./actions/actions";
import actionTypes from "./actions/actionTypes";
import Requester from "./managers/requester";
import KeyboardListener from "./managers/keyboardListener";
import Dispatcher from "./dispatcher/dispatcher";

export default function initFunction(x, y, radiusOfVisionForNetwork) {
    actions.initStore(
        x,
        y,
        radiusOfVisionForNetwork
    );

    Requester.receiveNetwork(actions.networkReady);

    const callbackId = Dispatcher.register((actionData) => {
        if (actionData.type !== actionTypes.networkReady) {
            return;
        }
        Dispatcher.unregister(callbackId);
        KeyboardListener.startListening(actions.keyPressed);
    });
}
