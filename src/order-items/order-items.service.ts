import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrderItemsService {
  constructor(private manager: EntityManager) {}

  
  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const { orderId, productId, quantity, subtotal } = createOrderItemDto;
  
    
    const order = await this.manager.findOne(Order, { where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
  
    
    const product = await this.manager.findOne(Product, { where: { id: productId } });
    if (!product) {
      throw new Error('Product not found');
    }
  
    
    const orderItem = this.manager.create(OrderItem, {
      order,
      product,
      quantity,
      subtotal,
    });
  
    
    return this.manager.save(orderItem);
  }  

  
  async findAll(): Promise<OrderItem[]> {
    return this.manager.find(OrderItem);
  }

  
  async findOne(id: number): Promise<OrderItem> {
    return this.manager.findOne(OrderItem, { where: { id } });
  }

  
  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    const { orderId, productId, quantity, subtotal } = updateOrderItemDto;
  
    
    const orderItem = await this.manager.findOne(OrderItem, {
      where: { id },
      relations: ['order', 'product'], 
    });
  
    if (!orderItem) {
      throw new Error('Order Item not found');
    }
  
    
    if (orderId) {
      const order = await this.manager.findOne(Order, { where: { id: orderId } });
      if (!order) {
        throw new Error('Order not found');
      }
      orderItem.order = order; 
    }
  
    
    if (productId) {
      const product = await this.manager.findOne(Product, { where: { id: productId } });
      if (!product) {
        throw new Error('Product not found');
      }
      orderItem.product = product; 
    }
  
    
    if (quantity) orderItem.quantity = quantity;
    if (subtotal) orderItem.subtotal = subtotal;
  
    
    await this.manager.save(orderItem);
  
    return orderItem;
  }
  

  
  async remove(id: number): Promise<void> {
    await this.manager.delete(OrderItem, id);
  }
}
