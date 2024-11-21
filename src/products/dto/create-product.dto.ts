import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/category.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
  name: string;

  @ApiProperty({ example: 100.00, description: 'The price of the product' })
  price: number;

  @ApiProperty({ example: 10, description: 'The stock of the product' })
  stock: number;

  @ApiProperty({ example: 1, description: 'The ID of the category' })
  category_id: number;

  @ApiProperty({ example: 'available', description: 'The status of the product' })
  status: 'available' | 'out_of_stock';
}