// order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/users.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export enum PaymentMethod {
  CASH = 'cash',
  MIDTRANS = 'midtrans',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column('decimal')
  total: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'cancelled'] })
  status: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
