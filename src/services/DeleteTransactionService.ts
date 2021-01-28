import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository?: TransactionsRepository) {
    this.transactionRepository =
      transactionRepository || getCustomRepository(TransactionsRepository);
  }

  public async execute(id: string): Promise<void> {
    const transaction = await this.transactionRepository.find({
      where: {
        id
      }
    });

    if (!transaction) {
      throw new AppError(`Transaction with ${id} id not exists.`, 400);
    }

    await this.transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
