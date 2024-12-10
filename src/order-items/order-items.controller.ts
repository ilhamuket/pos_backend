import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderItem } from './entities/order-item.entity';

@ApiTags('OrderItems') // Menggunakan tag untuk Swagger
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({ status: 201, description: 'The order item has been successfully created.', type: OrderItem })
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all order items' })
  @ApiResponse({ status: 200, description: 'Return all order items', type: [OrderItem] })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order item by id' })
  @ApiResponse({ status: 200, description: 'Return the found order item', type: OrderItem })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order item' })
  @ApiResponse({ status: 200, description: 'The order item has been updated.', type: OrderItem })
  update(@Param('id') id: string, @Body() updateOrderItemDto: UpdateOrderItemDto) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiResponse({ status: 200, description: 'The order item has been deleted' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}
