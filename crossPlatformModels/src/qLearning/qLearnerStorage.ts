import range from 'lodash/range';
import first from 'lodash/first';
import isArray from 'lodash/isArray';

import { TURNS } from "../direction";
import { QLearner } from "./qLearningClass";

export class QLearnerTransaction {
    constructor(
        public state: Array<number>,
        public actions: Array<Array<ActionTransaction>> = []
    ) {}

    getReward(deep: number = 10): number {
        return this.actions.reduce((actionsAccum, currValue) => 
            actionsAccum + currValue.reduce((accum, currValue) => currValue.getReward(deep) + accum, 0),
            0
        );
    }

    static getNetworkInputs(action: number) {
        const actionNumber = Object.keys(TURNS).length;

        const inputs = range(0, actionNumber, 0);
        inputs[action] = 1;

        return inputs;
    }

    static normilizeImage(image: Array<number>) {
        return image.map(value => (value + 1) / 2);
    }

    getStateNetworkMap() {
        return this.actions.map((actionArray, index) => {
            const firstElement = first(actionArray);
            if(!firstElement && firstElement.nextState) {
                return null;
            }
            return {
                input: [
                    ...QLearnerTransaction.getNetworkInputs(index),
                    ...QLearnerTransaction.normilizeImage(this.state)
                ],
                output: [
                    ...firstElement.nextState.state
                ]
            };
        });
    }

    getRewardNetworkMap() {
        return this.actions.map((actionArray, index) => ({
            input: [
                ...QLearnerTransaction.getNetworkInputs(index),
                ...QLearnerTransaction.normilizeImage(this.state)
            ],
            output: [actionArray.reduce((accum, transaction) => accum + transaction.getReward(10), 0)]
        }));
    }
}

export class ActionTransaction {
    constructor(
        public count: number = 0,
        public averageReward: number = 0,
        public nextState: QLearnerTransaction | null
    ) {}

    getReward(deep: number): number {
        if(!deep || !this.nextState) {
            return this.averageReward;
        } else {
            return this.nextState.getReward(deep - 1);
        }
    }
}