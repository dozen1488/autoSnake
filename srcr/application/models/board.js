import _ from 'lodash';
import {Layer, Network} from 'synaptic';

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
        
        this.radiusOfVision = 1;
        this.path = [];

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
            (this.board[head.x][head.y] === SellsMeaning.SnakeTail)
            head.x > this.board.length ||
            head.y > _.first(this.board).length
        if(gameOverCondition) {
            this.gameOver();
        }

        this.didSnakeEatLustTurn = (this.board[head.x][head.y] === SellsMeaning.Food) ?
            true : false;
        this.printSnakeTail();
        if(tail){ 
            this.board[tail.x][tail.y] = SellsMeaning.Empty;
        }

        if(this.didSnakeEatLustTurn) this.saveImage(1);
        else if(gameOverCondition) this.saveImage(-1);
        else this.saveImage(0);
        
        return _.compact(_.concat(this.snake.tail, [tail]));
    }

    printSnakeTail() {
        this.snake.tail.forEach(
            ({x, y}, index) => {
                (this.board[x])[y] = (index === 0) ? 
                    SellsMeaning.SnakeHead :
                    SellsMeaning.SnakeTail
            }
        );
    }

    saveImage(result) {
        let image = new Array((this.radiusOfVision * 2 + 1) * (this.radiusOfVision * 2 + 1));
        const {x: middleX, y: middleY} = this.snake.head;

        let iteration = 0;
        for(let x = middleX - this.radiusOfVision; x <= (this.radiusOfVision + middleX); x++) {
            for(let y = middleY - this.radiusOfVision; y <= (this.radiusOfVision + middleY); y++) {
                if(
                    (x < 0) || 
                    (x > this.board.length - 1) ||
                    (y < 0) ||
                    (y > _.first(this.board).length - 1) || 
                    this.board[x][y] === SellsMeaning.SnakeTail || 
                    this.board[x][y] === SellsMeaning.Wall
                ) {
                    image[iteration++] = -1;
                } else if(this.board[x][y] === SellsMeaning.Food) {
                    image[iteration++] = 1;
                } else {
                    image[iteration++] = 0;
                }
            }
        }
        this.path.push({
            result,
            image
        });
    }

    gameOver() {
        sendImages(this.path);
        this.deadSnakeCallback();
        alert('Game Over');
    }    

}

function sendImages(images) {
    fetch(
        '/applyImages', 
        {
            method: 'POST',
            body: JSON.stringify(images),
            headers: {
                "Content-type": "application/json"
            }
        }
    ).then(() => console.log('ok'));
}

function generate(n){
    const size = (n * 2 + 1) * (n * 2 + 1);
    const inputLayer = new Layer(size);
    const hiddenLayer = new Layer(size);
    const outputLayer = new Layer(size);

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    const myNetwork = new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}