import _ from "lodash";
import rotateMatrix from "rotate-matrix";

import { DIRECTIONS } from "./direction";
import { Snake } from "./snakeModel";
import CellTypes from "./CellTypes.json";
import ErrorConstants from "./errorConstants.json";

class BoardModel {

    constructor(
        { sizeOfX = 2, sizeOfY = 2 }, //    Size
        { network, radiusOfVisionForNetwork = 1 } //  Network settings
    ) {
        if (sizeOfX < 2 || sizeOfY < 2) {
            throw new Error(ErrorConstants.TOO_SMALL_BOARD);
        }

        this.board = new Array(sizeOfX)
            .fill(0)
            .map(() => new Array(sizeOfY).fill(CellTypes.Empty));
        this.snake = new Snake(
            {
                x: Math.round(sizeOfX / 2),
                y: Math.round(sizeOfY / 2),
            },
            network
        );

        this.snake.tail.forEach(
            ({ x, y }, index) => {
                (this.board[x])[y] = (index === 0)
                ? CellTypes.SnakeHead
                : CellTypes.SnakeTail;
            }
        );
        this.radiusOfVisionForNetwork = radiusOfVisionForNetwork;
        this.path = [];
        this.increaseSnake = false;
    }
    appendWall(x, y) {
        this.board[x][y] = CellTypes.Wall;

        return { x, y };
    }

    appendFood(x, y) {
        this.board[x][y] = CellTypes.Food;

        return { x, y };
    }

    updateState() {
        const boardSnap = this._snapshotBoardAroundSnake(
            this.radiusOfVisionForNetwork,
            this.snake.direction
        );

        const lastHead = this.snake.head;
        const lastTail = this.snake.end;

        const { head, turn } = this.snake.move(this.increaseSnake, boardSnap);

        const newHead = this.snake.head;
        const newTail = this.snake.end;

        if (!this.increaseSnake) {
            this.board[lastTail.x][lastTail.y] = CellTypes.Empty;
        }

        const gameOverCondition = !this._isPointValid(head.x, head.y);

        if (gameOverCondition) {
            this._saveSnapshotForNetwork(boardSnap, -1, turn);

            return this._gameOver();
        }

        this.increaseSnake = (this.board[head.x][head.y] === CellTypes.Food);

        this._printSnakeTail();

        if (this.increaseSnake) {
            this._saveSnapshotForNetwork(boardSnap, 1, turn);
        } else {
            this._saveSnapshotForNetwork(boardSnap, 0, turn);
        }

        return { isGameOver: false, changedSquares: [lastHead, lastTail, newHead, newTail] };
    }

    get isGameOver() {
        return !!this._isGameOver;
    }

    _printSnakeTail() {
        this.snake.tail.forEach(
            ({ x, y }, index) => {
                (this.board[x])[y] = (index === 0)
                ? CellTypes.SnakeHead
                : CellTypes.SnakeTail;
            }
        );
    }

    _snapshotBoardAroundSnake(snapshotRadius, snakeDirection) {
        let image = new Array((snapshotRadius * 2 + 1))
            .fill(0)
            .map(() => new Array((snapshotRadius * 2 + 1)).fill(0));
        const { x: middleX, y: middleY } = this.snake.head;

        for (let x = middleX - snapshotRadius, inX = 0;
            x <= (snapshotRadius + middleX);
            x++, inX++
        ) {
            for (let y = middleY - snapshotRadius, inY = 0;
                y <= (snapshotRadius + middleY);
                y++, inY++
            ) {
                if (!this._isPointValid(x, y)) {
                    image[inX][inY] = -1;
                } else if (this.board[x][y] === CellTypes.Food) {
                    image[inX][inY] = 1;
                } else {
                    image[inX][inY] = 0;
                }
            }
        }

        switch (snakeDirection) {
            case DIRECTIONS.LEFT:
                break;
            case DIRECTIONS.RIGHT:
                image = rotateMatrix(image, 2);
                break;
            case DIRECTIONS.UP:
                image = rotateMatrix(image, 3);
                break;
            case DIRECTIONS.DOWN:
                image = rotateMatrix(image);
                break;
        }

        return _.flatten(image);
    }

    _saveSnapshotForNetwork(snapshot, result, direction) {
        if (this.path.length < 100) {
            this.path.push({
                result,
                image: snapshot,
                decision: direction
            });
        }
    }

    _gameOver() {
        this._isGameOver = true;

        return {
            isGameOver: true,
            images: this.path
        };
    }

    _isPointValid(x, y) {
        return !(
            (x < 0) ||
            (x > this.board.length - 1) ||
            (y < 0) ||
            (y > _.first(this.board).length - 1) ||
            (this.board[x][y] === CellTypes.Wall) ||
            (this.board[x][y] === CellTypes.SnakeTail)
        );
    }

}

export {
    BoardModel as BoardModel,
    Snake as SnakeModel,
    CellTypes as CellTypes
};
