import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

const TABLE_NAME = 'transactions';
const FK_NAME = 'TransactionCategoryFK';

export default class AddCategoryFKtoTransactions1611769337814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      TABLE_NAME,
      new TableForeignKey({
        name: FK_NAME,
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(TABLE_NAME, FK_NAME);
  }
}
