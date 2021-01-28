import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import TransactionsRepository, { Balance } from '../repositories/TransactionsRepository';

interface BalanceTransactionServiceDTO {
  transactions: Transaction[];
  balance: Balance;
}

class BalanceTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository?: TransactionsRepository) {
    this.transactionRepository =
      transactionRepository || getCustomRepository(TransactionsRepository);
  }

  public async execute(): Promise<BalanceTransactionServiceDTO> {
    const transactions = await this.transactionRepository.find();
    const balance = await this.transactionRepository.getBalance();

    return {
      transactions,
      balance
    };
  }
}

export default BalanceTransactionService;
