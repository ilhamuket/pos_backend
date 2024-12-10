import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;

  @Column({ type: 'enum', enum: ['cash', 'midtrans'] })
  payment_method: 'cash' | 'midtrans';

  @Column({ type: 'enum', enum: ['pending', 'success', 'failed'] })
  payment_status: 'pending' | 'success' | 'failed';

  @Column({ type: 'json', nullable: true })
  transaction_data: any;

  @CreateDateColumn()
  created_at: Date;
}
