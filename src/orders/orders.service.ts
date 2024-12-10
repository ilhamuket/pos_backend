import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,  
    private readonly usersService: UsersService,
  ) {}

  
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
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
    const { userId, ...orderData } = createOrderDto;

    
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    
    const order = this.orderRepository.create({
      ...orderData,
      user, 
    });

    
    return this.orderRepository.save(order);
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
