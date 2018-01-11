import * as actions from "./actions/actions";
import Requester from "./managers/requester";
import KeyboardListener from "./managers/keyboardListener";
import Store from "./stores/store";

export default function initFunction(x, y, radiusOfVisionForNetwork) {
    const dispatchScenario = Store.dispatch.bind(Store);

    dispatchScenario(actions.initStore(x, y, radiusOfVisionForNetwork));

    Requester.receiveNetwork((...args) => dispatchScenario(actions.networkReady(...args)));

    const unsub = Store.subscribe(() => {
        if (!Store.getState().get("gameState").get("networkReady")) {
            return;
        }
        unsub();
        KeyboardListener.startListening((...args) => dispatchScenario(actions.keyPressed(...args)));
    });
}
