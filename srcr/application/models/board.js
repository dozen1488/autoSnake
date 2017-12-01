import _ from 'lodash';

import Snake from './snake';
import SellsMeaning from '../sharedConstants/SellsMeanind';

export default class BoardModel {

    constructor(x, y, deadSnakeCallback) {
        this.board = new Array(x)
            .fill(0)
            .map(() => new Array(y).fill(SellsMeaning.Empty));

        this.snake = new Snake({
            x: Math.round(x/2), 
            y: Math.round(y/2)
        });
        this.snake.tail.forEach(
            ({x, y}, index) => {
                (this.board[x])[y] = (index === 0) ? 
                    SellsMeaning.SnakeHead :
                    SellsMeaning.SnakeTail
            }
        );
        
        this.didSnakeEatLustTurn = false;
        this.deadSnakeCallback = deadSnakeCallback;
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
        const {head, deleted: tail} = this.snake.move(this.didSnakeEatLustTurn);

        const gameOverCondition = (this.board[head.x][head.y] === SellsMeaning.Wall) || 
            head.x > this.board.length ||
            head.y > _.first(this.board).length
        if(gameOverCondition) {
            this.gameOver();
        }

        this.didSnakeEatLustTurn = (this.board[head.x][head.y] === SellsMeaning.Food) ?
            true : false;
        this.board[head.x][head.y] = SellsMeaning.SnakeHead;
        if(tail) this.board[tail.x][tail.y] = SellsMeaning.Empty;

        return _.compact([head, tail]);
    }

    gameOver() {
        this.deadSnakeCallback();
        alert('Game Over');
    }    

}