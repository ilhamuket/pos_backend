import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';
import { AuthGuard } from '@nestjs/passport';
import * as midtransClient from 'midtrans-client';


@ApiTags('Transactions') 
@ApiBearerAuth() 
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.', type: Transaction })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseGuards(AuthGuard('jwt'))  
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of all transactions', type: [Transaction] })
  @UseGuards(AuthGuard('jwt'))  
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction by id' })
  @ApiResponse({ status: 200, description: 'Transaction found', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @UseGuards(AuthGuard('jwt'))  
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific transaction by id' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @UseGuards(AuthGuard('jwt'))  
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.update(Number(id), updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific transaction by id' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @UseGuards(AuthGuard('jwt'))  
  async remove(@Param('id') id: string): Promise<void> {
    return this.transactionsService.remove(Number(id));
  }

  @Post(':orderId/midtrans')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.', type: Transaction })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTransaction(@Param('orderId') orderId: number): Promise<any> {
    try {
      const midtransResponse = await this.transactionsService.createMidtransTransaction(orderId);
      return { status: 'success', data: midtransResponse };
    } catch (error) {
      console.error('Midtrans error:', error);
      throw new HttpException(error.message, error.status || 400);
    }
  }


  
  @Post('midtrans/notification')
  @ApiOperation({ summary: 'Handle Midtrans notification' })
  @ApiResponse({ status: 200, description: 'The notification has been successfully handled.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async handleNotification(@Request() req): Promise<string> {
    const notification = req.body;

    const apiClient = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: 'SB-Mid-server-o1ajMIhAJSsiHH6zNEhl4vNA', 
    });

    const statusResponse = await apiClient.transaction.notification(notification);

    
    const orderId = parseInt(statusResponse.order_id.split('-')[1]);

    
    const transaction = await this.transactionsService.findByOrderId(orderId);

    if (!transaction) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    let orderStatus = '';
    
    if (statusResponse.transaction_status === 'settlement') {
      transaction.payment_status = 'success';
      orderStatus = 'paid'; 
    } else if (statusResponse.transaction_status === 'cancel' || statusResponse.transaction_status === 'expire') {
      transaction.payment_status = 'failed';
      orderStatus = 'cancelled'; 
    }

    
    await this.transactionsService.updateTransaction(transaction, orderStatus);

    return 'Notification handled';
  }

}
