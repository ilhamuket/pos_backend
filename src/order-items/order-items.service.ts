import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private manager: EntityManager) {}

  // Create
  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.manager.create(OrderItem, createOrderItemDto);
    return this.manager.save(orderItem);
  }

  // Find all
  async findAll(): Promise<OrderItem[]> {
    return this.manager.find(OrderItem);
  }

  // Find one by ID
  async findOne(id: number): Promise<OrderItem> {
    return this.manager.findOne(OrderItem, { where: { id } });
  }

  // Update by ID
  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    await this.manager.update(OrderItem, id, updateOrderItemDto);
    return this.manager.findOne(OrderItem, { where: { id } });
  }

  // Delete by ID
  async remove(id: number): Promise<void> {
    await this.manager.delete(OrderItem, id);
  }
}
