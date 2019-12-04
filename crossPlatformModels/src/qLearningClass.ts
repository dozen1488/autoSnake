import range from "lodash/range";
//const range = require('lodash/range')

import { Network, Trainer } from "synaptic";
//const { Network } = require("synaptic")

import random from "lodash/random";
//const random = require('lodash/random')

import { TURNS } from "./direction";
//const { TURNS } = require('./direction')

import { generateNetwork } from "./generateNetwork";

import { radiusOfVisionForNetwork, FramesNumber } from "../../config.json";

export class QLearner {

    historyTransaction: Array<Transaction>
    network: Network
    actionCache: number 
    chanceOfRandomAction: number
    normalizeCoefficient: number
    maxValue: number
    experience: Array<Array<Transaction>>

    constructor(
        network?: any, historyTransaction : Array<Transaction> = [], chanceOfRandomAction: number = 100, maxValue = 0
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
        this.normalizeCoefficient = 1;
        this.experience = [];
        this.maxValue = maxValue;
    }

    normilizeValue(value: number) {
        if (value >= this.maxValue) {
            this.maxValue = value;
            return 1;
        } else {
            return value / this.maxValue;
        }
    }

    get lastTransaction() {
        return ((this.historyTransaction.length - 1) < 0)
            ? null
            : this.historyTransaction[this.historyTransaction.length - 1];
    }

    getErrorCoficient(sample: Array<Transaction>) {
        let sum = 0;
        if (sample.length > 1) {
            const sampleStart = sample[0];
            let currentSample: Transaction | null = sampleStart;
            while (currentSample) {
                if (!currentSample.firstFrame) {
                    currentSample = currentSample.nextState;
                    continue;
                }
                const inputs = QLearner.getNetworkInputs(currentSample.action);

                const networkInputs = [
                    ...inputs,
                    ...currentSample.firstFrame,
                    ...((currentSample && currentSample.secondFrame) || currentSample.firstFrame)
                ];

                const reward = +this.normilizeValue(currentSample.getReward());
                const answer = this.network.activate(networkInputs);
                sum = (reward - answer[0]) ** 2;
                currentSample = currentSample.nextState;
            }
        }
        return Math.sqrt(sum);
    }

    saveTransaction(screenFrame: Array<number>, action: number, reward: number) {
        let previousTransaction = this.lastTransaction;
        const newTransaction = new Transaction(
            (previousTransaction && previousTransaction.secondFrame) || null,
            screenFrame,
            this.actionCache,
            reward,
            null
        );
        this.actionCache = action;
        this.historyTransaction.push(newTransaction);
        if (previousTransaction) {
            previousTransaction.nextState = newTransaction;
        }
    }

    static getActionCases() {
        const actionNumber = Object.keys(TURNS).length;

        return range(0, actionNumber, 0)
            .map((_value: any, index: number) => {
                const inputs = range(0, actionNumber, 0);
                inputs[index] = 1;

                return inputs;
            });
    }

    static getNetworkInputs(action: number) {
        const actionNumber = Object.keys(TURNS).length;

        const inputs = range(0, actionNumber, 0);
        inputs[action] = 1;

        return inputs;
    }

    makenetworkDecision(
        image: any,
        nextImage: any
    ) {
        const { index: resultIndex } = QLearner.getActionCases().reduce(
            ({ index, maxValue }: any, currentInputs: Array<number>, currIndex: number) => {
                const input = [
                    ...currentInputs,
                    ...image,
                    ...nextImage
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
        console.log("Decision: " + resultIndex);
        return resultIndex;
    }

    makeExploringAction() {
        return random(0, QLearner.getActionCases().length - 1);
    }

    makeDecision(
        image: any,
        nextImage = (this.lastTransaction && this.lastTransaction.secondFrame) || image,
        chanceOfRandomAction = this.chanceOfRandomAction
    ) {
        if (random(0, 100) > chanceOfRandomAction) {
            return this.makenetworkDecision(image, nextImage);
        } else {
            return this.makeExploringAction();
        }
    }

    serialize() {
        return {
            maxValue: this.maxValue,
            network: this.network.toJSON(),
            historyTransaction: this.historyTransaction.map(t => t.serialize()),
            chanceOfRandomAction: this.chanceOfRandomAction
        };
    }

    static deserialize(plainJSON: any) {
        if (!plainJSON) {
            return new QLearner();
        }
        let historyTransaction = [];
        if (plainJSON.historyTransaction) {
            historyTransaction = plainJSON.historyTransaction.map(
                (plainTransaction: any) => Transaction.deserialize(plainTransaction)
            );

            for (let index = 0; index < historyTransaction.length - 1; index++) {
                historyTransaction[index].nextState = historyTransaction[index + 1];
            }
        }

        return new QLearner(plainJSON.network, historyTransaction, plainJSON.chanceOfRandomAction, plainJSON.maxValue);
    }

    trainBatch(input: any, result: number) {
        let answer = null;
        do {
            answer = this.network.activate(input)[0];
            this.network.propagate(0.1, [result]);
        } while (Math.abs(answer - result) > 0.1);
    }

    clearExperiance() {
        this.experience = this.experience.filter(
            (sample => this.getErrorCoficient(sample) >= 0.0001)
        )
    }

    trainSample(sample: Array<Transaction>) {
        if (sample.length > 1) {
            const trainingData = sample.slice(1).map(currentSample => {
                const inputs = QLearner.getNetworkInputs(currentSample.action);
                const networkInputs = [
                    ...inputs,
                    ...currentSample.firstFrame || [],
                    ...((currentSample && currentSample.secondFrame) || currentSample.firstFrame)
                ];
                
                const reward = +this.normilizeValue(currentSample.getReward());
                return {
                    input: networkInputs,
                    output: [reward]
                };
            });
            const trainer = new Trainer(this.network);
            trainer.train(trainingData, {
                error: .005,
                rate: .05,
                log: 1000
            });
        }
        return this.getErrorCoficient(sample);
    }

    adjustNetwork() {
        for (let index = 0; index < this.experience.length; index++) {
            this.trainSample(this.experience[index]);
            console.log(this.getErrorCoficient(this.experience[index]));
        }
        this.clearExperiance();
        this.chanceOfRandomAction = this.chanceOfRandomAction > 10 ? this.chanceOfRandomAction - 1 : this.chanceOfRandomAction;
    }
}

export class Transaction {
    firstFrame: Array<number> | null // First frame
    secondFrame:  Array<number> // Next frame
    action: number // Action brought to Next frame
    reward: number // Reward in transaction
    nextState: Transaction | null // next transaction

    constructor(firstFrame: Array<number> | null,
        secondFrame: Array<number>,
        action: number,
        reward: number,
        nextState: Transaction | null
    ) {
        this.firstFrame = firstFrame;
        this.secondFrame = secondFrame;
        this.action = action;
        this.reward = reward;
        this.nextState = nextState;
    }

    static deserialize(plainJSON: any, nextState?: any) {
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

    getReward(): number {
        if (this.nextState) {
            return this.reward + this.nextState.getReward();
        } else {
            return +this.reward;
        }
    }
}
