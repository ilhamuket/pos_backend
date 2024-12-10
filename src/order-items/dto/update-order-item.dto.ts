import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsNumber } from 'class-validator';

export class UpdateOrderItemDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  orderId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  subtotal?: number;
}
