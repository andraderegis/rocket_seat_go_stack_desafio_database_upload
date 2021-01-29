import fs from 'fs';
import parse from 'csv-parse';

import { Parser } from './Parser';

export interface TransactionCsvDTO {
  title: string;
  value: number;
  type: string;
  category: string;
}

class TransactionCSVParser implements Parser<TransactionCsvDTO> {
  public async execute(filePath: string): Promise<TransactionCsvDTO[]> {
    const transactions: TransactionCsvDTO[] = [];

    const parseStream = parse({
      columns: true,
      ltrim: true,
      rtrim: true
    });

    const parseReadStream = fs
      .createReadStream(filePath)
      .pipe(parseStream)
      .on('data', data => {
        transactions.push(data as TransactionCsvDTO);
      });

    await new Promise(resolve => {
      parseReadStream.on('end', resolve);
    });

    return transactions;
  }
}

export default TransactionCSVParser;
