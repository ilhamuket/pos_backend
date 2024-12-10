// create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number; // ID user yang membuat order

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsEnum(['pending', 'paid', 'cancelled'])
  status: string;
}
