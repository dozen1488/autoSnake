import range from "lodash/range";
//const range = require('lodash/range')

import { NeuralNetwork } from "brain.js";

import random from "lodash/random";
import isEqual from "lodash/isEqual";
//const random = require('lodash/random')

import { TURNS } from "./direction";
//const { TURNS } = require('./direction')

import { generateRewardNetwork, generateStateNetwork } from "./generateNetwork";

import { radiusOfVisionForNetwork, FramesNumber } from "../../config.json";

export class QLearner {

    historyTransaction: Array<Transaction>
    stateNetwork: NeuralNetwork
    rewardNetwork: NeuralNetwork
    actionCache: number
    chanceOfRandomAction: number
    normalizeCoefficient: number
    maxValue: number
    experience: any

    constructor(
        stateNetwork?: any, rewardNetwork?: any, historyTransaction: Array<Transaction> = [], chanceOfRandomAction: number = 120, maxValue = 0
    ) {
        this.historyTransaction = historyTransaction;
        this.stateNetwork = (stateNetwork)
            ? (new NeuralNetwork()).fromJSON(stateNetwork)
            : generateStateNetwork(
                radiusOfVisionForNetwork,
                radiusOfVisionForNetwork,
                Object.keys(TURNS).length
            );;
        this.rewardNetwork = (rewardNetwork)
            ? (new NeuralNetwork()).fromJSON(rewardNetwork)
            : generateRewardNetwork(
                radiusOfVisionForNetwork,
                radiusOfVisionForNetwork,
                Object.keys(TURNS).length
            );
        this.actionCache = 0;
        this.chanceOfRandomAction = chanceOfRandomAction;
        this.normalizeCoefficient = 1;
        this.experience = {
            stateExperiance: [],
            rewardExperiance: []
        };
        this.maxValue = maxValue;
    }

    normilizeImage(image: Array<number>) {
        return image.map(value => (value + 1) / 2);
    }

    denormilizeImage(image: Array<number>) {
        return image.map(value => Math.round(value / 0.5) * 0.5 * 2 - 1);
    }

    normilizeValue(value: number) {
        if (value >= this.maxValue) {
            return 1;
        } else {
            return value / this.maxValue;
        }
    }

    updateNormalizeCoefficient(value: number) {
        if (value >= this.maxValue) {
            const oldValue = this.maxValue;
            this.maxValue = value;
            this.experience.rewardExperiance = this.experience.rewardExperiance.map(
                (experiance: any) => ({
                    ...experiance,
                    output: [experiance.output[0] * oldValue / value]
                })
            );
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
                const answer = this.rewardNetwork.run(networkInputs);
                sum = (reward - answer[0]) ** 2;
                currentSample = currentSample.nextState;
            }
        }
        return Math.sqrt(sum);
    }

    saveTransaction(screenFrame: Array<number>, action: number, reward: number, direction: number) {
        let previousTransaction = this.lastTransaction;
        const newTransaction = new Transaction(
            screenFrame, //(previousTransaction && previousTransaction.secondFrame) || null,
            screenFrame,
            action,
            reward,
            null,
            direction
        );
        this.actionCache = action;
        this.historyTransaction.push(newTransaction);
        if (previousTransaction) {
            previousTransaction.nextState = newTransaction;
        }
    }

    static getInputByDirection(direction: number) {
        const array = range(0, Object.keys(TURNS).length, 0);
        array[direction] = 1;
        return array;
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

    makeNetworkDecision(
        image: any,
        direction: number
    ) {
        const { index: resultIndex } = QLearner.getActionCases().reduce(
            ({ index, maxValue }: any, currentInputs: Array<number>, currIndex: number) => {
                const nextStateInput = [
                    ...currentInputs,
                    ...this.normilizeImage(image)
                ]
                // const newState = this.stateNetwork.run(nextStateInput);
                const input = [
                    ...QLearner.getInputByDirection(direction),
                    ...currentInputs,
                    ...this.normilizeImage(image)
                ];
                const [valueFunction] = this.rewardNetwork.run(input);
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
        direction: number,
        nextImage = (this.lastTransaction && this.lastTransaction.secondFrame) || image,
        chanceOfRandomAction = this.chanceOfRandomAction,
    ) { 
        if (random(0, 100) > chanceOfRandomAction) {
            return this.makeNetworkDecision(image, direction);
        } else {
            return this.makeExploringAction();
        }
    }

    serialize() {
        return {
            maxValue: this.maxValue,
            stateNetwork: this.stateNetwork.toJSON(),
            rewardNetwork: this.rewardNetwork.toJSON(),
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

        return new QLearner(plainJSON.stateNetwork, plainJSON.rewardNetwork, historyTransaction, plainJSON.chanceOfRandomAction, plainJSON.maxValue);
    }

    trainSample() {
        // this.stateNetwork.train(this.experience.stateExperiance);
        const rate = 0.9;
        let error = 1;
        let diff = 1;
        while (error > 0.0005 && diff > 0.00004) {
            const result = this.rewardNetwork.train(
                this.experience.rewardExperiance,
                {
                    learningRate: rate - diff + 0.1,
                    errorThresh: 0.005,
                    iterations: 2000, 
                    logPeriod: 1000,
                    log: (error) => console.log(error)
                }
            );
            diff = error - result.error;
            error = result.error;
        }
    }

    saveNewData(newExperiance: Array<Transaction>) {
        const trainingStateData = newExperiance
            .filter((currentSample) => currentSample.firstFrame)
            .map(currentSample => {
                const inputs = QLearner.getNetworkInputs(currentSample.action);
                const networkInputs = [
                    ...QLearner.getInputByDirection(currentSample.direction),
                    ...inputs,
                    ...this.normilizeImage(currentSample.firstFrame || [])
                ];

                return {
                    input: networkInputs,
                    output: this.normilizeImage((currentSample && currentSample.secondFrame) || currentSample.firstFrame)
                };
            });
        const filteredStateExp = this.experience.stateExperiance.filter((previousExperiance: any) => {
            const sameInput = trainingStateData.find((newData: any) => isEqual(newData, previousExperiance));
            return !sameInput;
        });
        // this.experience.stateExperiance = filteredStateExp.concat(trainingStateData);
        let trainingRewardData: Array<any> = newExperiance
            .filter((currentSample) => currentSample.firstFrame)
            .map(currentSample => {
                const inputs = QLearner.getNetworkInputs(currentSample.action);
                const networkInputs = [
                    ...QLearner.getInputByDirection(currentSample.direction),
                    ...inputs,
                    ...this.normilizeImage(currentSample.firstFrame || [])
                ];

                const reward = currentSample.getReward();
                this.updateNormalizeCoefficient(reward);

                return {
                    input: networkInputs,
                    output: [this.normilizeValue(reward)]
                };
            });

        const filteredExp = this.experience.rewardExperiance.filter((previousExperiance: any) => {
            const sameInput = trainingRewardData.find(
                (newData: any) => isEqual(newData.input, previousExperiance.input)
            );
            if (sameInput) {
                if (sameInput.output[0] >= previousExperiance.output[0]) {
                    return false;
                } else {
                    trainingRewardData.splice(trainingRewardData.indexOf(sameInput), 1);
                    return true;
                }
            }
            return true;
        });
        this.experience.rewardExperiance = filteredExp.concat(trainingRewardData);
        console.log("State experiance: " + this.experience.stateExperiance.length);
        console.log("Reward experiance: " + this.experience.rewardExperiance.length);
    }

    adjustNetwork() {
        // this.clearExperiance();
        this.trainSample();
        this.chanceOfRandomAction = this.chanceOfRandomAction > 5 ? this.chanceOfRandomAction - 1 : this.chanceOfRandomAction;
    }
}

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
}
