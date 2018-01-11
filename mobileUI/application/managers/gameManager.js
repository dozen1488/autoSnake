import _ from "lodash";

import { BoardModel } from "../../../crossPlatformModels/boardModel";
import Impulser from "./impulser";

class GameManager {

    /**
     * creating GameManager
     * @param {Function} impulseCallback - callback for impulsing
     * @param {Function} gameOverCallback - callback for gameOver
     * @param {Number} refresh frequency
     * @param {Object} dimensions - object with x,y numbers which are dimensions
     * @param {Object} networkSettings - object with neural network in json and
     * radiusOfVisionForNetwork as number
     * @returns {Object} GameManager
    **/

    constructor(
        impulseCallback,
        gameOverCallback,

        impulseFrequency,

        dimensions,
        networkSettings
    ) {
        if (!impulseCallback ||
            !gameOverCallback ||
            isNaN(impulseFrequency) ||
            !_.has(dimensions, "sizeOfX", "sizeOfY") ||
            !_.has(networkSettings, "network", "radiusOfVisionForNetwork")
        ) {
            throw new Error("no requested property for creation GameManager");
        }

        this._boardModel = new BoardModel(dimensions, networkSettings);
        this._impulseCallback = impulseCallback;
        this._gameOverCallback = gameOverCallback;

        this._impulsingFunc = Impulser.startImpulsing(() => this._impulseBoard());
    }

    _impulseBoard() {
        let { isGameOver, changedSquares, images } = this._boardModel.updateState();
        if (isGameOver) {
            this._gameOverCallback(images);
        } else {
            changedSquares = changedSquares
                .map(({ x, y }) => ({ x, y, state: this._boardModel.board[x][y] }));
            this._impulseCallback(changedSquares);
        }
    }

    appendWall(x, y) {
        return {
            ...this._boardModel.appendWall(x, y),
            state: this._boardModel.board[x][y]
        };
    }

    appendFood(x, y) {
        return {
            ...this._boardModel.appendFood(x, y),
            state: this._boardModel.board[x][y]
        };
    }

    resumeImpulsing() {
        if (this._impulsingFunc) {
            this.pauseImpulsing();
        }
        this._impulsingFunc = Impulser.startImpulsing(() => this._impulseBoard());
    }

    pauseImpulsing() {
        Impulser.stopImpulsing(this._impulsingFunc);
        this._impulsingFunc = null;
    }
}

export default GameManager;
