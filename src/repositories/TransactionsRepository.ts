import { EntityRepository, Repository } from 'typeorm';

import Transaction, { TransactionType } from '../models/Transaction';

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = this.getTotalTransactionsByType(transactions, TransactionType.income);

    const outcome = this.getTotalTransactionsByType(transactions, TransactionType.outcome);

    return {
      income,
      outcome,
      total: income - outcome
    };
  }

  private getTotalTransactionsByType(transactions: Transaction[], type: string): number {
    try {
      return transactions
        .filter(transaction => transaction.type === type)
        .map(transaction => transaction.value)
        .reduce((sum, current) => {
          return sum + current;
        });
    } catch (e) {
      return 0;
    }
  }
}

export default TransactionsRepository;
