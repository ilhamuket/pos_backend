import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Order])], // Menambahkan Transaction ke TypeOrmModule
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
