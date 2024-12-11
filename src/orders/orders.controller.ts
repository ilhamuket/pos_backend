import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
 } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Orders')
@ApiBearerAuth() // Menambahkan bearer auth di Swagger
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created.', type: Order })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseGuards(AuthGuard('jwt')) // Autentikasi menggunakan JWT
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.', type: [Order] })
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending orders' })
  @ApiResponse({ status: 200, description: 'Return pending orders.', type: [Order] })
  @UseGuards(AuthGuard('jwt'))
  async getPendingOrders(@Request() req): Promise<Order[]> {
    const userId = req.user.id; // Extract userId from JWT payload
    return await this.ordersService.findPendingOrdersByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiResponse({ status: 200, description: 'Return a single order.', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiResponse({ status: 200, description: 'Order successfully updated.', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string): Promise<void> {
    return await this.ordersService.remove(+id);
  }
}
