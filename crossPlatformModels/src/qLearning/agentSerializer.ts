import { TransactionsStorage } from './transactionsStorage';
import { Transaction } from './Transaction';

export class AgentSerializer extends TransactionsStorage {
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
            return new AgentSerializer();
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

        return new AgentSerializer(
            historyTransaction,
            plainJSON.stateNetwork,
            plainJSON.rewardNetwork,
            plainJSON.chanceOfRandomAction,
            plainJSON.maxValue
        );
    }
}