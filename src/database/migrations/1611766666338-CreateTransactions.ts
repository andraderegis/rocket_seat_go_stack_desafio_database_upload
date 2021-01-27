import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'transactions';

export default class CreateTransactions1611766666338 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'value',
            type: 'decimal',
            isNullable: false
          },
          {
            name: 'type',
            type: 'enum',
            isNullable: false,
            enum: ['income', 'outcome']
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
