import { IsEnum, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The order ID associated with the transaction',
    example: 1234, 
  })
  @IsNumber()
  orderId: number;

  @ApiProperty({
    description: 'The payment method used for the transaction',
    enum: ['cash', 'midtrans'],
    example: 'cash', 
  })
  @IsEnum(['cash', 'midtrans'])
  payment_method: 'cash' | 'midtrans';

  @ApiProperty({
    description: 'The current status of the payment',
    enum: ['pending', 'success', 'failed'],
    example: 'pending', 
  })
  @IsEnum(['pending', 'success', 'failed'])
  payment_status: 'pending' | 'success' | 'failed';

  @ApiProperty({
    description: 'Additional transaction data, if any',
    type: Object,
    required: false,
    example: { additional_info: 'some data' }, 
  })
  @IsOptional()
  @IsObject()
  transaction_data?: any;
}
