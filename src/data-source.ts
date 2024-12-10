import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './order-items/entities/order-item.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Order, OrderItem],  // Menambahkan entitas di sini
  synchronize: false,
  migrations: ['src/migrations/*.ts'],  // Path untuk file migrasi
  subscribers: [],
});
