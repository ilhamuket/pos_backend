import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  // Tambahkan metode query kustom sesuai kebutuhan

   // Mendapatkan semua order beserta detail
   async findAllOrdersWithDetails(): Promise<Order[]> {
    return this.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' }, // pastikan `createdAt` sesuai dengan nama field
    });
  }

  // Mendapatkan order berdasarkan ID dengan detail
  async findOrderByIdWithDetails(id: number): Promise<Order> {
    return this.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }
  
}
