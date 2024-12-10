import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './order.repository';  
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';  
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository, User, Order])],  
  controllers: [OrdersController],
  providers: [OrdersService, UsersService],  
})
export class OrdersModule {}