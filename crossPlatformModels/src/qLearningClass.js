import range from "lodash/range";
//const range = require('lodash/range')

import { Network } from "synaptic";
//const { Network } = require("synaptic")

import random from "lodash/random";
//const random = require('lodash/random')

import { TURNS } from "./direction";
//const { TURNS } = require('./direction')

import { generateNetwork } from "./generateNetwork";

import { radiusOfVisionForNetwork, FramesNumber } from "../../config";

export class QLearner {
    constructor(
        network, historyTransaction = [], chanceOfRandomAction = 70
    ) {
        const networkObject = (network)
            ? Network.fromJSON(network)
            : generateNetwork(
                radiusOfVisionForNetwork,
                radiusOfVisionForNetwork,
                FramesNumber,
                Object.keys(TURNS).length
            );
        this.historyTransaction = historyTransaction;
        this.network = networkObject;
        this.actionCache = 0;
        this.chanceOfRandomAction = chanceOfRandomAction;
        this.normalizeCoefficient = 3;
        this.experience = [];
    }

    normilizeValue(value) {
        if (value > this.normalizeCoefficient) {
            return 1;
        } else {
            return value / this.normalizeCoefficient;
        }
    }

    get lastTransaction() {
        return ((this.historyTransaction.length - 1) < 0)
            ? null
            : this.historyTransaction[this.historyTransaction.length - 1];
    }

    saveTransaction(screenFrame, action, reward) {
        let previousTransaction = this.lastTransaction;
        if (!previousTransaction) {
            previousTransaction = { secondFrame: screenFrame };
        }
        const newTransaction = new Transaction(
            previousTransaction.secondFrame,
            screenFrame,
            this.actionCache,
            reward,
            null
        );
        this.actionCache = action;
        this.historyTransaction.push(newTransaction);
        previousTransaction.nextState = newTransaction;
    }

    static getActionCases() {
        const actionNumber = Object.keys(TURNS).length;

        return range(0, actionNumber, 0)
            .map((value, index) => {
                const inputs = range(0, actionNumber, 0);
                inputs[index] = 1;

                return inputs;
            });
    }

    static getNetworkInputs(action) {
        const actionNumber = Object.keys(TURNS).length;

        const inputs = range(0, actionNumber, 0);
        inputs[action] = 1;

        return inputs;
    }

    makeDecision(image) {
        if (random(0, 100) > this.chanceOfRandomAction) {
            const { index: resultIndex } = QLearner.getActionCases().reduce(
                ({ index, maxValue }, currentInputs, currIndex) => {
                    const input = [
                        ...currentInputs,
                        ...image,
                        ...((this.lastTransaction && this.lastTransaction.secondFrame) || image)
                    ];
                    const [valueFunction] = this.network.activate(input);
                    if (valueFunction >= maxValue) {
                        return {
                            index: currIndex,
                            maxValue: valueFunction
                        };
                    } else {
                        return { index, maxValue };
                    }
                }, {
                    index: -1,
                    maxValue: -Infinity
                }
            );

            return resultIndex;
        } else {
            return random(0, QLearner.getActionCases().length);
        }
    }

    serialize() {
        return {
            network: this.network.toJSON(),
            historyTransaction: this.historyTransaction.map(t => t.serialize()),
            chanceOfRandomAction: this.chanceOfRandomAction
        };
    }

    static deserialize(plainJSON) {
        if (!plainJSON) {
            return new QLearner();
        }
        let historyTransaction = [];
        if (plainJSON.historyTransaction) {
            historyTransaction = plainJSON.historyTransaction.map(
                (plainTransaction) => Transaction.deserialize(plainTransaction)
            );

            for (let index = 0; index < historyTransaction.length - 1; index++) {
                historyTransaction[index].nextState = historyTransaction[index + 1];
            }
        }

        return new QLearner(plainJSON.network, historyTransaction, plainJSON.chanceOfRandomAction);
    }

    trainBatch(input, result) {
        let answer = null;
        do {
            answer = this.network.activate(input)[0];
            this.network.propagate(0.1, [result]);
        } while (Math.abs(answer - result) > 0.1);
    }

    trainSample(sample) {
        if (sample.length > 0) {
            const sampleStart = sample[0];
            // const sampleStart = sample[random(0, sample.length - 1)];
            let currentSample = sampleStart;
            while (currentSample) {
                const inputs = QLearner.getNetworkInputs(currentSample.action);

                const networkInputs = [
                    ...inputs,
                    ...currentSample.firstFrame,
                    ...((currentSample && currentSample.secondFrame) || currentSample.firstFrame)
                ];

                const reward = +this.normilizeValue(currentSample.getReward());
                for (let index = 0; index < 20; index++) {
                    this.network.activate(networkInputs);
                    this.network.propagate(0.03, [reward]);
                }
                currentSample = currentSample.nextState;
            }
        }
    }

    adjustNetwork() {
        for (let index = 0; index < this.experience.length; index++) {
            this.trainSample(this.experience[index]);
        }
        this.chanceOfRandomAction = this.chanceOfRandomAction - 1;
    }

    isValidDesitions() {
        const sampleStart = this.historyTransaction[0];
        let currentSample = sampleStart;
        while (currentSample) {
            const inputs = QLearner.getNetworkInputs(currentSample.action);

            const networkInputs = [
                ...inputs,
                ...currentSample.firstFrame,
                ...((currentSample.lastTransaction && currentSample.lastTransaction.secondFrame) || currentSample.firstFrame)
            ];

            const reward = currentSample.getReward();
            this.network.activate(networkInputs);
            this.network.propagate(0.2, [reward]);
            currentSample = currentSample.nextState;
        }
    }
}

export class Transaction {
    constructor(firstFrame, secondFrame, action, reward, nextState) {
        this.firstFrame = firstFrame;
        this.secondFrame = secondFrame;
        this.action = action;
        this.reward = reward;
        this.nextState = nextState;
    }

    static deserialize(plainJSON, nextState) {
        return new Transaction(
            plainJSON.firstFrame,
            plainJSON.secondFrame,
            plainJSON.action,
            plainJSON.reward,
            nextState
        );
    }

    serialize() {
        return {
            firstFrame: this.firstFrame,
            secondFrame: this.secondFrame,
            action: this.action,
            reward: this.reward,
            nextState: null
        };
    }

    getReward() {
        if (this.nextState) {
            return this.reward + this.nextState.getReward();
        } else {
            return +this.reward;
        }
    }
}
