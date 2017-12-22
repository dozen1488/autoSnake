import ActionTypes from "./actionTypes";
import MouseCLicks from "../sharedConstants/MouseClickMeaning.json";

import Store from "../stores/store";
import Dispatcher from "../dispatcher/dispatcher";
import { Requester } from "../managers/externalManagers";

let gameManager;

export function changeBoard(changedSquares) {
    Dispatcher.dispatch({
        type: ActionTypes.changeBoard, changedSquares
    });
}

export function gameOver(images) {

    const { gameManager } = Store.getState();
    gameManager.pauseImpulsing();

    Dispatcher.dispatch({
        type: ActionTypes.gameOver
    });

    Requester.sendImages(images).then(() => {});
}

export function onClick(x, y, buttonNumber) {
    let changedSquares;
    const gameManager = Store.getState().gameManager;

    if (buttonNumber === MouseCLicks.leftButton) {
        changedSquares = [gameManager.appendWall(x, y)];
    } else if (buttonNumber === MouseCLicks.rightButton) {
        changedSquares = [gameManager.appendFood(x, y)];
    }

    Dispatcher.dispatch({
        changedSquares,
        type: ActionTypes.onClick,
        buttonType: buttonNumber
    });
}

export function onHover(x, y) {

    let changedSquares = [];
    const {
        isMouseWallClicked,
        isMouseFoodClicked,
        gameManager
    } = Store.getState();
    
    if (isMouseWallClicked) {
        changedSquares = [gameManager.appendWall(x, y)];
    } else if (isMouseFoodClicked) {
        changedSquares = [gameManager.appendFood(x, y)];
    }

    Dispatcher.dispatch({
        changedSquares, type: ActionTypes.onHover
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

export function keyPressed(key) {
    if (key === "Space") {

        const { isPaused, gameManager } = Store.getState();
        if (isPaused) {
            gameManager.resumeImpulsing();
        } else {
            gameManager.pauseImpulsing();
        }
        Dispatcher.dispatch({
            type: ActionTypes.spacePressed
        });
    }
}
