import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Order } from '../orders/entities/order.entity';
import * as midtransClient from 'midtrans-client';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Order) 
    private readonly orderRepository: Repository<Order>,
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

  async createMidtransTransaction(orderId: number): Promise<any> {
    const order = await this.transactionRepository.manager.findOne(Order, { 
      where: { id: orderId }, 
      relations: ['user', 'items', 'items.product'] 
    });
    
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  
    const snap = new midtransClient.Snap({
      isProduction: false, 
      serverKey: 'SB-Mid-server-o1ajMIhAJSsiHH6zNEhl4vNA',
    });
  
    const transactionDetails = {
      transaction_details: {
        order_id: `ORDER-${order.id}-${Date.now()}`,
        gross_amount: order.total,
      },
      customer_details: {
        first_name: order.user.username,
        email: order.user.email,
      },
      item_details: order.items.map(item => ({
        id: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
        name: item.product.name,
      })),
    };
  
    try {
      const midtransResponse = await snap.createTransaction(transactionDetails);
  
      const transaction = this.transactionRepository.create({
        order,
        payment_method: 'midtrans',
        payment_status: 'pending',
        transaction_data: midtransResponse,
      });
  
      await this.transactionRepository.save(transaction);
  
      return midtransResponse;
    } catch (error) {
      throw new HttpException('Failed to create transaction with Midtrans', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async findByOrderId(orderId: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { order: { id: orderId } }, 
      relations: ['order'], 
    });
  }

  
  async updateTransaction(transaction: Transaction, orderStatus: string): Promise<void> {
    
    await this.transactionRepository.save(transaction);

    
    const order = transaction.order;
    order.status = orderStatus;
    await this.orderRepository.save(order); 
  }

}
