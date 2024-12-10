import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/entities/order.entity';

@Entity('user') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Jangan simpan password sebagai teks biasa, lakukan hashing!

  @Column({ 
    type: 'enum', 
    enum: ['admin', 'cashier'], 
    default: 'cashier' // Default agar tidak error jika kolom role baru ditambahkan
  })
  role: 'admin' | 'cashier';

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
