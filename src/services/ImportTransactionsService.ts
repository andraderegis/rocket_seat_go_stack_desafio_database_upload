import fs from 'fs';
import { getCustomRepository, In } from 'typeorm';

import AppError from '../errors/AppError';
import { Parser } from '../utils/parsers/Parser';
import CategoryRepository from '../repositories/CategoryRepository';
import TransactionRespository from '../repositories/TransactionsRepository';
import Transaction, { TransactionType } from '../models/Transaction';
import TransactionCSVParser, { TransactionCsvDTO } from '../utils/parsers/TransactionCSVParser';
import Category from '../models/Category';

class ImportTransactionsService {
  private parser: Parser<TransactionCsvDTO>;

  private categoryRepository: CategoryRepository;

  private transactionRespository: TransactionRespository;

  constructor(
    parser?: Parser<TransactionCsvDTO>,
    categoryRepository?: CategoryRepository,
    transactionRespository?: TransactionRespository
  ) {
    this.categoryRepository = categoryRepository || getCustomRepository(CategoryRepository);
    this.parser = parser || new TransactionCSVParser();
    this.transactionRespository =
      transactionRespository || getCustomRepository(TransactionRespository);
  }

  async execute(csvFilePath: string): Promise<Transaction[]> {
    const fileExists = await fs.promises.stat(csvFilePath);

    if (!fileExists) {
      throw new AppError('CSV file not exits.');
    }

    const csvTransactions = await this.parser.execute(csvFilePath);

    if (!csvTransactions) {
      throw new AppError('CSV is empty or data format is invalid.');
    }

    await fs.promises.unlink(csvFilePath);

    const csvCategoriesTitle = csvTransactions.map(csvTransaction => csvTransaction.category);

    await this.categoryRepository.saveCategoriesByTitle(csvCategoriesTitle);

    const categoriesInRepository = await this.getCategoriesAsMapByTitleKey(csvCategoriesTitle);

    const transactionsToSave = csvTransactions.map(csvTransaction => {
      return this.transactionRespository.create({
        title: csvTransaction.title,
        category_id: categoriesInRepository.get(csvTransaction.category)?.id,
        type: TransactionType[csvTransaction.type as TransactionType],
        value: csvTransaction.value
      });
    });

    return this.transactionRespository.save(transactionsToSave);
  }

  private async getCategoriesAsMapByTitleKey(
    categoriesTitle: string[]
  ): Promise<Map<string, Category>> {
    const categoriesMap = new Map();

    const categoriesInRepository = await this.categoryRepository.find({
      select: ['id', 'title'],
      where: {
        title: In(categoriesTitle)
      }
    });

    for (let index = 0; index < categoriesInRepository.length; index += 1) {
      const category = categoriesInRepository[index];
      categoriesMap.set(category.title, category);
    }

    return categoriesMap;
  }
}

export default ImportTransactionsService;
