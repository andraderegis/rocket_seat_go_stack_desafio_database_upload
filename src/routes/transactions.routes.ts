import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';

import BalanceTransactionService from '../services/BalanceTransactionService';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const balanceTransactionService = new BalanceTransactionService();

  const balanceTransactions = await balanceTransactionService.execute();

  return response.status(200).json(balanceTransactions);
});

transactionsRouter.post('/', async (request, response) => {
  const createTransactionService = new CreateTransactionService();

  const { title, value, type, category } = request.body;

  const createTransaction = await createTransactionService.execute({
    title,
    value,
    type,
    category
  });

  return response.status(201).json(createTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
