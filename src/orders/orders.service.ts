import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly usersService: UsersService,
  ) {}

  
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findPendingOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: 'pending', user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
  }  

  
  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, products, paymentMethod } = createOrderDto;
  
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    const productEntities = await this.productRepository.findByIds(
      products.map((p) => p.productId),
    );
  
    if (productEntities.length !== products.length) {
      throw new Error('One or more products not found');
    }
  
    let total = 0;
    const orderItems = products.map((product) => {
      const productEntity = productEntities.find((p) => p.id === product.productId);
      if (!productEntity) {
        throw new Error(`Product with ID ${product.productId} not found`);
      }
  
      const subtotal = product.quantity * Number(productEntity.price);
      total += subtotal;
  
      return this.orderItemRepository.create({
        product: productEntity,
        quantity: product.quantity,
        subtotal,
      });
    });
  
    const order = this.orderRepository.create({
      user,
      paymentMethod,
      total,
      status: 'pending', 
    });
  
    const savedOrder = await this.orderRepository.save(order);
  
   
    const savedOrderItems = orderItems.map((item) => ({
      ...item,
      order: savedOrder,
    }));
    await this.orderItemRepository.save(savedOrderItems);
  
    return savedOrder;
  }
  

  
  async update(id: number, updateOrderDto: any): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
  }

  
  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
