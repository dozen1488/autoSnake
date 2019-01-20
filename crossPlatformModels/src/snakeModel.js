import _ from "lodash";

import { QLearner } from "./qLearningClass";
import { Direction, TURNS } from "./direction";

export class Snake {
    constructor(startPoint, networkJSON) {
        this._direction = new Direction();
        this._tail = [];
        this._tail.push(startPoint);
        this.qLearner = new QLearner(networkJSON );
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

    get direction() {
        return this._direction.direction;
    }

    move(withIncrement, environment) {
        const turn = this._getTurn(environment, withIncrement);
        switch (turn) {
            case TURNS.LEFT:
                this._direction.left();
                break;
            case TURNS.RIGHT:
                this._direction.right();
                break;
            case TURNS.UP:
                this._direction.up();
                break;
            case TURNS.DOWN:
                this._direction.down();
                break;
        }

        //  calculate next point of head
        const difference = this._direction.getCoordinateDiff();
        const newHead = _.clone(_.head(this._tail));
        newHead.x += difference.x;
        newHead.y += difference.y;

        //  push to start of array
        this._tail.unshift(newHead);

        if (!withIncrement) {
            this._tail.pop();
        }

        return { head: newHead, turn };
    }

    _getTurn(image, withIncrement) {
        const networkAnswer = this.qLearner.makeDecision(image);
        this.qLearner.saveTransaction(image, networkAnswer, withIncrement);

        return networkAnswer;
    }
}
