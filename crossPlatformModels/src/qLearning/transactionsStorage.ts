import _ from 'lodash';

import { QLearner } from './qLearningClass';
import { Transaction } from './Transaction';
import { QLearnerTransaction, ActionTransaction } from './qLearnerStorage';

export class TransactionsStorage extends QLearner {

    historyTransaction: Array<Transaction>
    actionCache: number
    experience: Array<QLearnerTransaction>

    constructor(
        historyTransaction: Array<Transaction> = [],
        ...args: any
    ) {
        super(...args);
        this.historyTransaction = historyTransaction;
        this.actionCache = 0;
        this.experience = []; 
    }

    get lastTransaction() {
        return ((this.historyTransaction.length - 1) < 0)
            ? null
            : this.historyTransaction[this.historyTransaction.length - 1];
    }

    saveTransaction(screenFrame: Array<number>, action: number, reward: number, direction: number) {
        let previousTransaction = this.lastTransaction;
        const newTransaction = new Transaction(
            (previousTransaction && previousTransaction.secondFrame) || null,
            screenFrame,
            this.actionCache,
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

    saveNewData(newExperiance: Array<Transaction>, storage: Array<QLearnerTransaction> = this.experience) {
        newExperiance.forEach((transaction: Transaction) => {
            if (!transaction.firstFrame) {
                return;
            }
            let storedTransaction;
            let nextState: Array<number>;
            let storedNextTransaction: QLearnerTransaction | null | undefined;
            const firstState = transaction.mapToState();
            storedTransaction = storage.find((experiance: any) => _.isEqual(firstState, experiance.state));

            if (!storedTransaction) {
                storedTransaction = new QLearnerTransaction(firstState);
                storage.push(storedTransaction);
            }

            if (transaction.nextState) {
                nextState = transaction.nextState.mapToState();
                storedNextTransaction = storage.find(
                    (experiance: QLearnerTransaction) => _.isEqual(nextState, experiance.state)
                );
                if (!storedNextTransaction) {
                    storedNextTransaction = new QLearnerTransaction(nextState);
                    storage.push(storedNextTransaction);
                }
            } else {
                storedNextTransaction = null;
            }

            let nextStates = storedTransaction.actions[transaction.action];
            if (!nextStates) {
                storedTransaction.actions[transaction.action] = nextStates = [];
            }
            const nextTransaction = nextStates.find((action: ActionTransaction) => _.isEqual(action.nextState, storedNextTransaction));
            if (nextTransaction) {
                nextTransaction.averageReward = 
                    nextTransaction.averageReward * nextTransaction.count + transaction.reward;
                nextTransaction.count += 1;
                nextTransaction.averageReward = nextTransaction.averageReward / nextTransaction.count;
            } else {
                nextStates.push(new ActionTransaction(
                    0,
                    transaction.getReward()
                    ,storedNextTransaction
                ))
            }
        });
    }
}