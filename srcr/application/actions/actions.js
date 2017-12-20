import Dispatcher from "../dispatcher/dispatcher";
import ActionTypes from "./actionTypes";

export function impulseBoard() {
    Dispatcher.dispatch({
        type: ActionTypes.impulseBoard
    });
}

export function onClick(x, y, buttonNumber) {
    Dispatcher.dispatch({
        x, y, type: ActionTypes.onClick, buttonType: buttonNumber
    });
}

export function onHover(x, y) {
    Dispatcher.dispatch({
        x, y, type: ActionTypes.onHover
    });
}
    
export function onRelease() {
    Dispatcher.dispatch({
        type: ActionTypes.onRelease
    });
}

export function initStore(x, y, radiusOfVisionForNetwork) {
    Dispatcher.dispatch({
        x, y, type: ActionTypes.initStore, radiusOfVisionForNetwork
    });
}

export function stopImpulse() {
    Dispatcher.dispatch({
        type: ActionTypes.stopImpulse,
    });
}

export function networkReady(network) {
    Dispatcher.dispatch({
        type: ActionTypes.networkReady, network
    });
}

export function keyPressed(key) {
    Dispatcher.dispatch({
        type: ActionTypes.keyPressed, key
    });
}
