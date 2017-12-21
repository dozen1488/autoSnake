import Dispatcher from "../dispatcher/dispatcher";
import ActionTypes from "./actionTypes";

export function changeBoard(changedSquares) {
    Dispatcher.dispatch({
        type: ActionTypes.changeBoard, changedSquares
    });
}

export function gameOver(images) {
    Dispatcher.dispatch({
        type: ActionTypes.gameOver, images
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

export function networkReady(network) {
    Dispatcher.dispatch({
        type: ActionTypes.networkReady, network
    });
}

export function spacePressed(key) {
    Dispatcher.dispatch({
        type: ActionTypes.keyPressed, key
    });
}
