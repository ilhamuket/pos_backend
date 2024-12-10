import { IsEnum, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  orderId: number;

  @IsEnum(['cash', 'midtrans'])
  payment_method: 'cash' | 'midtrans';

  @IsEnum(['pending', 'success', 'failed'])
  payment_status: 'pending' | 'success' | 'failed';

  @IsOptional()
  @IsObject()
  transaction_data?: any;
}
