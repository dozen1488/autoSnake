import _ from 'lodash';

import { TURNS } from "../direction";

export class Transaction {
    firstFrame: Array<number> | null // First frame
    secondFrame: Array<number> // Next frame
    action: number // Action brought to Next frame
    reward: number // Reward in transaction
    nextState: Transaction | null // next transaction
    direction: number

    constructor(
        firstFrame: Array<number> | null,
        secondFrame: Array<number>,
        action: number,
        reward: number,
        nextState: Transaction | null,
        direction: number
    ) {
        this.firstFrame = firstFrame;
        this.secondFrame = secondFrame;
        this.action = action;
        this.reward = reward;
        this.nextState = nextState;
        this.direction = direction;
    }

    static deserialize(plainJSON: any, nextState?: any) {
        return new Transaction(
            plainJSON.firstFrame,
            plainJSON.secondFrame,
            plainJSON.action,
            plainJSON.reward,
            nextState,
            plainJSON.direction
        );
    }

    serialize() {
        return {
            firstFrame: this.firstFrame,
            secondFrame: this.secondFrame,
            action: this.action,
            reward: this.reward,
            nextState: null,
            direction: this.direction
        };
    }

    getReward(): number {
        if (this.nextState) {
            return this.reward + 0.1 + this.nextState.getReward();
        } else {
            return +this.reward;
        }
    }

    static getInputByDirection(direction: number) {
        const array = _.range(0, Object.keys(TURNS).length, 0);
        array[direction] = 1;
        return array;
    }
    
    static normilizeImage(image: Array<number>) {
        return image.map(value => (value + 1) / 2);
    }

    mapToState() {
        if(this.firstFrame){
            return [
                ...Transaction.getInputByDirection(this.direction),
                ...Transaction.normilizeImage(this.firstFrame)
            ];
        } else {
            return [];
        }
    }
}
