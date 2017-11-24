import _ from 'lodash';
import Dispatcher from '../dispatchers/BoardDispatcher';

import Snake from './snake';
import SellsMeaning from '../sharedConstants/SellsMeanind.json';

export default class BoardModel {

    constructor(x, y) {
        this.board = new Array(x).fill(0).map(() => new Array(y).fill(SellsMeaning.Empty));

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

        Dispatcher.register((eventData) => {
            switch(eventData.eventName) {
                case 'onMouseOver': 

                break;
                case 'onClick':
                
                break;
            }
        });
        
        this.didSnakeEatLustTurn = false;
    }

    appendWall({x, y}) {
        this.board[x][y] = SellsMeaning.Wall;
        return {x, y};
    }

    appendFood({x, y}) {
        this.board[x][y] = SellsMeaning.Food;
        return {x, y};
    }

    updateState() {
        const {head, tail} = this.snake.move(this.didSnakeEatLustTurn);

        const gameOverCondition = (this.board[x][y] === SellsMeaning.Wall) || 
            head.x > this.board.length ||
            head.y > _.first(this.board).length
        if(gameOverCondition) {
            this.gameOver();
        }

        this.didSnakeEatLustTurn = (this.board[head.x][head.y] === SellsMeaning.Food) ?
            true : false;
        this.board[head.x][head.y] = SellsMeaning.SnakeHead;
        if(tail) this.board[tail.x][tail.y] = SellsMeaning.Empty;

        return {head, tail};
    }

    gameOver() {
        alert('Game Over');
    }    

}