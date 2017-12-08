import _ from 'lodash';
import {Layer, Network} from 'synaptic';

import {Snake, DIRECTIONS} from './snake';
import SellsMeaning from '../sharedConstants/SellsMeanind';

export default class BoardModel {

    constructor(
        {sizeOfX, sizeOfY}, //Size
        {network, radiusOfVisionForNetwork} //Network settings
    ) {
        this.board = new Array(sizeOfX)
            .fill(0)
            .map(() => new Array(sizeOfY).fill(SellsMeaning.Empty));

        this.snake = new Snake(
            {
                x: Math.round(sizeOfX/2), 
                y: Math.round(sizeOfY/2),
            },
            network
        );

        this.snake.tail.forEach(
            ({x, y}, index) => {
                (this.board[x])[y] = (index === 0) ? 
                    SellsMeaning.SnakeHead :
                    SellsMeaning.SnakeTail
            }
        );
        
        this.radiusOfVisionForNetwork = radiusOfVisionForNetwork;
        this.path = [];

        this.didSnakeEatLustTurn = false;
    }

    appendWall(x, y) {
        this.board[x][y] = SellsMeaning.Wall;
        return {x, y};
    }

    appendFood(x, y) {
        this.board[x][y] = SellsMeaning.Food;
        return {x, y};
    }

    updateState(){
        const boardSnap = this._snapshotBoardAroundSnake(
            this.radiusOfVisionForNetwork,
            this.snake.direction
        );
        const changedSquares = [];

        changedSquares.push(this.snake.head);
        if (!this.didSnakeEatLustTurn) changedSquares.push(this.snake.end);

        const {head, turn} = this.snake.move(
            this.didSnakeEatLustTurn, 
            boardSnap
        );

        changedSquares.push(this.snake.head);

        if(!this.didSnakeEatLustTurn) {
            changedSquares.push(this.snake.end);
            const tail = this.snake.end;
            this.board[tail.x][tail.y] = SellsMeaning.Empty;
        }

        const gameOverCondition = !this._isPointValid(
            head.x, head.y
        );

        this.didSnakeEatLustTurn = (this.board[head.x][head.y] === SellsMeaning.Food);

        this._printSnakeTail();

        if(this.didSnakeEatLustTurn) this._saveSnapshotForNetwork(boardSnap, 1, turn);
        else if(gameOverCondition) this._saveSnapshotForNetwork(boardSnap, -1, turn);
        else this._saveSnapshotForNetwork(boardSnap, 0, turn);
        

        return (gameOverCondition) ? 
            this.gameOver():
            {
                isGameOver: false,
                changedSquares: changedSquares
            };
    }

    _printSnakeTail() {
        this.snake.tail.forEach(
            ({x, y}, index) => {
                (this.board[x])[y] = (index === 0) ? 
                    SellsMeaning.SnakeHead :
                    SellsMeaning.SnakeTail
            }
        );
    }

    _snapshotBoardAroundSnake(snapshotRadius, snakeDirection) {
        let image = new Array(
            (snapshotRadius * 2 + 1) * (snapshotRadius * 2 + 1)
        );
        const {x: middleX, y: middleY} = this.snake.head;

        let iteration = 0;
        let fromX, toX, fromY, toY;

        switch (snakeDirection) {
            case DIRECTIONS.LEFT:
                fromX = middleX - snapshotRadius;
                toX = snapshotRadius + middleX;
                fromY = middleY - snapshotRadius;
                toY = snapshotRadius + middleY;
            break;
            case DIRECTIONS.RIGHT:
                fromX = snapshotRadius + middleX;
                toX = middleX - snapshotRadius;
                fromY = middleY - snapshotRadius;
                toY = snapshotRadius + middleY;
            break;
            case DIRECTIONS.UP:
                fromX = middleX - snapshotRadius;
                toX = snapshotRadius + middleX;
                fromY = snapshotRadius + middleY;
                toY = middleY - snapshotRadius;
            break;
            case DIRECTIONS.DOWN:
                fromX = snapshotRadius + middleX;
                toX = middleX - snapshotRadius;
                fromY = snapshotRadius + middleY;
                toY = middleY - snapshotRadius;
            break;
        }

        const action = (x, y) => {
            if(
                this._isPointValid(x, y)
            ) {
                image[iteration++] = -1;
            } else if(this.board[x][y] === SellsMeaning.Food) {
                image[iteration++] = 1;
            } else {
                image[iteration++] = 0;
            }
        }
        
        this._takeArraysFromTo(fromX, toX, fromY, toY, action);

        return image;
    }

    _saveSnapshotForNetwork(snapshot, result, direction) {
        this.path.push({
            result,
            image: snapshot,
            decision: direction
        });
    }

    _gameOver() {
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
            (this.board[x][y] === SellsMeaning.Wall) || 
            (this.board[x][y] === SellsMeaning.SnakeTail)
        );
    }

    _takeArraysFromTo(fromX, toX, fromY, toY, action) {
        let inc = (x) => ++x;
        let dec = (x) => --x;

        let xAction, yAction;
        if(fromX >= toX) {
            xAction = inc;
        } else {
            xAction = dec; 
        }
        if(fromY, toY) {
            yAction = inc;
        } else {
            yAction = dec; 
        }

        for(let x = fromX; x <= toX; x = xAction(x)) {
            for(let y = fromY; y <= toY; y = yAction(y)) {
                action(x,y);
            }
        }
    }

}