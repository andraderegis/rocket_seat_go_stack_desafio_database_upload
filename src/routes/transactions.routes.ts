import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '../config/upload';

import BalanceTransactionService from '../services/BalanceTransactionService';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

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
  const deleteTransactionService = new DeleteTransactionService();

  const { id } = request.params;

  await deleteTransactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();

  const { path } = request.file;

  const transactions = await importTransactionsService.execute(path);

  return response.status(200).json(transactions);
});

export default transactionsRouter;
