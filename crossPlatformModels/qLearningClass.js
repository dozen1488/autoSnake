import { TURNS } from "./direction";

export class QLearner {
    constructor(network) {
        this.historyTransaction = [];
        this.network = network;
        this.actionCache = null;
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

    makeDecision(image) {
        const actionNumber = Object.keys(TURNS).length;
        const actionCases = new Array(actionNumber).map((value, index) => {
            const inputs = new Array(actionNumber);
            inputs[index] = 1;

            return inputs;
        });

        const { index: resultIndex } = actionCases.reduce(
            ({ index, maxValue }, currentInputs, currIndex) => {
                const input = [...currentInputs, ...image, (this.lastTransaction.secondFrame || image)];
                const valueFunction = this.network.activate(input);
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
}
