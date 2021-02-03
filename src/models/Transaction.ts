import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import Category from './Category';

export enum TransactionType {
  income = 'income',
  outcome = 'outcome'
}

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false
  })
  title: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false
  })
  type: TransactionType;

  @Column({
    type: 'decimal'
  })
  value: number;

  @ManyToOne(() => Category, category => category.transaction, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @AfterLoad()
  convertValue(): void {
    this.value = parseFloat(this.value.toString());
  }
}

export default Transaction;
