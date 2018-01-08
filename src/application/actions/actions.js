import ActionTypes from "./actionTypes";
import MouseCLicks from "../sharedConstants/MouseClickMeaning.json";

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

export function onClick(x, y, buttonNumber) {
    let changedSquares;

    if (buttonNumber === MouseCLicks.leftButton) {
        changedSquares = [gameManager.appendWall(x, y)];
    } else if (buttonNumber === MouseCLicks.rightButton) {
        changedSquares = [gameManager.appendFood(x, y)];
    } else {
        return;
    }

    return {
        changedSquares,
        type: ActionTypes.onClick,
        buttonType: buttonNumber
    };
}

export function onHover(x, y) {

    let changedSquares = [];
    const {
        isMouseWallClicked,
        isMouseFoodClicked
    } = Store.getState().get("mouseState").toJS();

    if (isMouseWallClicked) {
        changedSquares = [gameManager.appendWall(x, y)];
    } else if (isMouseFoodClicked) {
        changedSquares = [gameManager.appendFood(x, y)];
    }

    return {
        changedSquares,
        type: ActionTypes.changeBoard
    };
}

export function onRelease() {
    return {
        type: ActionTypes.onRelease
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

export function keyPressed(key) {
    if (key === "Space") {

        const { isPaused } = Store.getState().toJS();
        if (isPaused) {
            gameManager.resumeImpulsing();
        } else {
            gameManager.pauseImpulsing();
        }

        return {
            type: ActionTypes.spacePressed
        };
    } else {
        return {};
    }
}
