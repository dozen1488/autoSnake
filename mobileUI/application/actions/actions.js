import ActionTypes from "./actionTypes";

import Store from "../stores/store";
import Requester from "../managers/requester";
import { impulseFrequency } from "../sharedConstants/configuration.json";
import GameManager from "../managers/gameManager";

let gameManager;

export function changeBoard(changedSquares) {
    return {
        type: ActionTypes.changeBoard, changedSquares
    };
}

export function gameOver(images) {

    gameManager.pauseImpulsing();

    Requester.sendImages(images);

    return {
        type: ActionTypes.gameOver
    };
}

export function onToggle(value) {
    return {
        type: ActionTypes.onToggle,
        value: value
    };
}

export function onClick(x, y) {

    let changedSquares = [];
    const isToggled = Store.getState().get("toggleState").get("toggle");

    if (isToggled) {
        changedSquares = [gameManager.appendWall(x, y)];
    } else {
        changedSquares = [gameManager.appendFood(x, y)];
    }

    return {
        changedSquares,
        type: ActionTypes.changeBoard
    };
}

export function initStore(x, y, radiusOfVisionForNetwork) {
    return {
        x, y, type: ActionTypes.initStore, radiusOfVisionForNetwork
    };
}

export function networkReady(network) {

    const { x, y, radiusOfVisionForNetwork } = Store
        .getState()
        .get("boardState")
        .toJS();

    gameManager = new GameManager(
        (...args) => Store.dispatch(changeBoard(...args)),
        (...args) => Store.dispatch(gameOver(...args)),
        impulseFrequency,
        {
            sizeOfX: x,
            sizeOfY: y,
        }, {
            network: network,
            radiusOfVisionForNetwork: radiusOfVisionForNetwork
        }
    );

    const board = gameManager._boardModel.board;

    return {
        type: ActionTypes.networkReady, board
    };
}

export function spacePressed() {

    const isPaused = Store.getState().get("gameState").get("isPaused");
    if (isPaused) {
        gameManager.resumeImpulsing();
    } else {
        gameManager.pauseImpulsing();
    }

    return {
        type: ActionTypes.spacePressed
    };
}
