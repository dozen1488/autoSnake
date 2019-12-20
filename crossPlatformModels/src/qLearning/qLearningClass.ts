import range from "lodash/range";
//const range = require('lodash/range')

import { NeuralNetwork } from "brain.js";

import _ from 'lodash';
import random from "lodash/random";
import isEqual from "lodash/isEqual";
//const random = require('lodash/random')

import { TURNS } from "../direction";
//const { TURNS } = require('./direction')

import { Transaction } from './Transaction';
import { generateRewardNetwork, generateStateNetwork } from "../generateNetwork";

import { radiusOfVisionForNetwork, FramesNumber } from "../../../config.json";

export class QLearner {

    stateNetwork: NeuralNetwork
    rewardNetwork: NeuralNetwork
    actionCache: number
    chanceOfRandomAction: number
    normalizeCoefficient: number
    maxValue: number
    experience: any

    constructor(
        stateNetwork?: any, rewardNetwork?: any, chanceOfRandomAction: number = 120, maxValue = 0
    ) {
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
    
    static getInputByDirection(direction: number) {
        const array = _.range(0, Object.keys(TURNS).length, 0);
        array[direction] = 1;
        return array;
    }

    makeNetworkDecision(
        image: any,
        direction: number
    ) {
        const { index: resultIndex } = QLearner.getActionCases().reduce(
            ({ index, maxValue }: any, currentInputs: Array<number>, currIndex: number) => {
                const nextStateInput = [
                    ...currentInputs,
                    ...QLearner.normilizeImage(image)
                ]
                // const newState = this.stateNetwork.run(nextStateInput);
                const input = [
                    ...currentInputs,
                    ...QLearner.getInputByDirection(direction),
                    ...QLearner.normilizeImage(image)
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
        const action = random(0, QLearner.getActionCases().length - 1);
        console.log("Random action: " + action);
        return action;
    }

    makeDecision(
        image: any,
        direction: number,
        chanceOfRandomAction = this.chanceOfRandomAction,
    ) { 
        if (random(0, 100) > chanceOfRandomAction) {
            return this.makeNetworkDecision(image, direction);
        } else {
            return this.makeExploringAction();
        }
    }

    trainSample() {
        // this.stateNetwork.train(this.experience.stateExperiance);
        let rewardError = 1;
        let rewardDiff = 1;
        while (rewardError > 0.0005 && rewardDiff > 0.00004) {
            const settings = {
                learningRate: 1 - 0.9 * rewardDiff,
                errorThresh: 0.005,
                iterations: 2000, 
                logPeriod: 1000,
                log: (error: any) => console.log(error)
            };
            const rewardResult = this.rewardNetwork.train(
                this.experience.rewardExperiance,
                settings
            );
            const stateResult = this.stateNetwork.train(
                this.experience.rewardExperiance,
                settings
            );
            rewardDiff = rewardError - rewardResult.error;
            rewardError = rewardResult.error;
        }
    }

    adjustNetwork() {
        // this.clearExperiance();
        this.trainSample();
        this.chanceOfRandomAction = this.chanceOfRandomAction > 5 ? this.chanceOfRandomAction - 1 : this.chanceOfRandomAction;
    }
}
