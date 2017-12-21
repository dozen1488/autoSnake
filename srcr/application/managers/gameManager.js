import _ from "lodash";

import { BoardModel } from "../../../crossPlatformModels/boardModel";
import { Impulser } from "./externalManagers";

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
    */
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
            !_.has(dimensions, ["x", "y"]) ||
            !_.has(networkSettings, ["network", "radiusOfVisionForNetwork"])
        ) {
            throw new Error("no requested property for creation GameManager");
        }

        this._boardModel = new BoardModel(dimensions, networkSettings);
        this._impulseCallback = impulseCallback;
        this._gameOverCallback = gameOverCallback;
        
        Impulser.startImpulsing(() => this.impulseBoard());
    }

    impulseBoard() {
        const { isGameOver, changedSquares, images } = this.board.updateState();

        if (isGameOver) {
            this.gameOverCallback(images);
        } else {
            this.impulseCallback(changedSquares);
        }
    }

    appendWall(x, y) {
        return this._boardModel.appendWall(x, y);
    }

    appendFood(x, y) {
        return this._boardModel.appendFood(x, y);
    }
}

export default GameManager;
