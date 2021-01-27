import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const TABLE_NAME = 'categories';
const UPDATE_COLUMN = 'title';

export default class AlterTitleFieldFromCategories1611771064231 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      TABLE_NAME,
      UPDATE_COLUMN,
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: false,
        isUnique: true
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      TABLE_NAME,
      UPDATE_COLUMN,
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: false
      })
    );
  }
}
