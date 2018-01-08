import ActionTypes from "./actionTypes";
import MouseCLicks from "../sharedConstants/MouseClickMeaning.json";

import Store from "../stores/store";
import Dispatcher from "../dispatcher/dispatcher";
import Requester from "../managers/requester";
import { impulseFrequency } from "../sharedConstants/configuration.json";
import GameManager from "../managers/gameManager";

let gameManager;

export function changeBoard(changedSquares) {
    Dispatcher.dispatch({
        type: ActionTypes.changeBoard, changedSquares
    });
}

export function gameOver(images) {

    gameManager.pauseImpulsing();

    Dispatcher.dispatch({
        type: ActionTypes.gameOver
    });

    Requester.sendImages(images);
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
        isMouseFoodClicked
    } = Store.getState().toJS();

    if (isMouseWallClicked) {
        changedSquares = [gameManager.appendWall(x, y)];
    } else if (isMouseFoodClicked) {
        changedSquares = [gameManager.appendFood(x, y)];
    }

    Dispatcher.dispatch({
        changedSquares, type: ActionTypes.changeBoard
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

    const { x, y, radiusOfVisionForNetwork } = Store.getState().toJS();

    gameManager = new GameManager(
        changeBoard,
        gameOver,
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

    Dispatcher.dispatch({
        type: ActionTypes.networkReady, board
    });
}

export function keyPressed(key) {
    if (key === "Space") {

        const { isPaused } = Store.getState().toJS();
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
