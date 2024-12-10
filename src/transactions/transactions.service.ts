import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { orderId, payment_method, payment_status, transaction_data } = createTransactionDto;
  
    
    const order = await this.transactionRepository.manager.findOne(Order, { where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
  
    
    const transaction = this.transactionRepository.create({
      order,
      payment_method,
      payment_status,
      transaction_data,
    });
  
    
    if (payment_status === 'success') {
      order.status = 'paid';  
    } else if (payment_status === 'failed') {
      order.status = 'cancelled';  
    }
  
    
    await this.transactionRepository.manager.save(order); 
  
    
    return this.transactionRepository.save(transaction);
  }
  

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: ['order'],
    }); 
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction; 
  }

  async update(id: number, updateTransactionDto: any): Promise<Transaction> {
    
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['order'], 
    });
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
  
    
    const oldPaymentStatus = transaction.payment_status;
  
    
    await this.transactionRepository.update(id, updateTransactionDto);
  
    
    const updatedTransaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['order'],
    });
  
    const { payment_status } = updatedTransaction;
  
    
    if (payment_status !== oldPaymentStatus) {
      if (payment_status === 'success') {
        updatedTransaction.order.status = 'paid'; 
      } else if (payment_status === 'failed') {
        updatedTransaction.order.status = 'cancelled'; 
      } else {
        updatedTransaction.order.status = 'pending'; 
      }
  
      
      await this.transactionRepository.manager.save(updatedTransaction.order);
    }
  
    
    return updatedTransaction;
  }
  

  async remove(id: number): Promise<void> {
    const transaction = await this.transactionRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await this.transactionRepository.delete(id); 
  }
}
