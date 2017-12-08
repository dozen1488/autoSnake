import _ from 'lodash';
import { dirname } from 'path';

export class Snake {
    constructor(startPoint, network) {
        this._direction = new Direction();
        this._tail = [];
        this._tail.push(startPoint);
        this._network = network;
    }

    get tail() {
        return _.cloneDeep(this._tail);
    }

    get head() {
        return _.cloneDeep(_.head(this._tail));
    }

    get end() {
        return _.cloneDeep(_.last(this._tail));
    }

    move(withIncrement, environment) {
        const turn = this._getTurn(environment);
        switch (turn) {
            case TURNS.LEFT:
                this._direction.left();
                break;
            case TURNS.RIGHT:
                this._direction.right();
                break;
        }

        //calculate next point of head
        const difference = this._direction.getCoordinateDiff();
        const newHead = _.clone(_.head(this._tail));
        newHead.x += difference.x;
        newHead.y += difference.y;

        //push to start of array
        this._tail.unshift(newHead);

        //remove tail if it's necessary
        let deletedTail;
        if (!withIncrement) {
            deletedTail = this._tail.pop();
        }

        return (withIncrement) ? {head: newHead, turn} : {head: newHead, turn};
    }

    _getTurn(image) {
        const networkAnswer = this._network.activate(image);

        //Find an index of the most value in array
        const {index: resultIndex} = networkAnswer.reduce(
            ({index, maxValue}, currValue, currIndex) => {
                if(currValue >= maxValue) {
                    return {
                        index: currIndex,
                        maxValue: currValue
                    }
                } else {
                    return {index, maxValue};
                }
            },{
                index: -1,
                maxValue: -Infinity
            }
        );

        //Map value to turn
        return resultIndex - 1;
    }
}

class Direction {
    constructor(dir = 0, maxDir = 3) {
        this._dir = dir;
        this._maxDIr = maxDir;
    }

    get direction() {
        return dir;
    }
    
    left() {
        this._dir--;
        if (this._dir < 0) {
            this._dir = this._maxDIr;
        }
        return this;
    }

    right() {
        this._dir++;
        if (this._dir > this._maxDIr) {
            this._dir = 0;
        }
        return this;
    }

    getCoordinateDiff() {
        switch (this._dir) {
            case DIRECTIONS.LEFT:
                return {
                    x: -1,
                    y: 0
                };
            case DIRECTIONS.UP:
                return {
                    x: 0,
                    y: 1
                };
            case DIRECTIONS.RIGHT:
                return {
                    x: 1,
                    y: 0
                };
            case DIRECTIONS.DOWN:
                return {
                    x: 0,
                    y: -1
                };
        }
    }
}

export const DIRECTIONS = {
    UP:1,
    DOWN:3,
    LEFT:0,
    RIGHT:2
};

const TURNS = {
    LEFT: -1,
    RIGHT: 1
}