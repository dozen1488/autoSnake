export class QLearner {
    constructor(network) {
        this.historyTransaction = [];
        this.network = network;
    }

    saveTransaction(screenFrame, action, reward) {
        let previousTransaction;
        if ((this.historyTransaction.length - 1) >= 0) {
            previousTransaction = screenFrame;
        } else {
            previousTransaction = this.historyTransaction[this.historyTransaction.length - 1];
        }
        const newTransaction = new Transaction(
            previousTransaction.secondFrame,
            screenFrame,
            action,
            reward,
            null
        );
        this.historyTransaction.push(newTransaction);
        previousTransaction.nextState = newTransaction;
    }

    makeDecision(image) {
        return this.network.activate(image);
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
