import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  subtotal: number;
}
