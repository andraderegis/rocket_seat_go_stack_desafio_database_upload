import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction, { TransactionType } from '../models/Transaction';

import CategoryRepository from '../repositories/CategoryRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CreateTransactionServiceDTO {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  private transactionRepository: TransactionsRepository;

  private categoryRepository: CategoryRepository;

  constructor(
    transactionRepository?: TransactionsRepository,
    categoryRepository?: CategoryRepository
  ) {
    this.transactionRepository =
      transactionRepository || getCustomRepository(TransactionsRepository);
    this.categoryRepository = categoryRepository || getCustomRepository(CategoryRepository);
  }

  public async execute({
    title,
    value,
    type,
    category
  }: CreateTransactionServiceDTO): Promise<Transaction> {
    const balance = await this.transactionRepository.getBalance();

    if (type === TransactionType.outcome) {
      if (balance.total < value) {
        throw new AppError('Outcome transaction exceeds incoming amount');
      }
    }

    const categoryInRepository = await this.getCategoryByTitle(category);

    const transaction = this.transactionRepository.create({
      title,
      value,
      category_id: categoryInRepository.id,
      type: TransactionType[type as TransactionType]
    });

    return this.transactionRepository.save(transaction);
  }

  private async getCategoryByTitle(title: string): Promise<Category> {
    let category = await this.categoryRepository.findOne({
      where: {
        title
      }
    });

    if (!category) {
      const createCategory = this.categoryRepository.create({
        title
      });

      category = await this.categoryRepository.save(createCategory);
    }

    return category;
  }
}

export default CreateTransactionService;
