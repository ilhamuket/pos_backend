// src/products/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Category } from '../categories/category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index('category_status_index', ['category', 'status'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The unique identifier of the product' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ example: 100.00, description: 'The price of the product' })
  price: number;

  @Column()
  @ApiProperty({ example: 10, description: 'The stock of the product' })
  stock: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  @ApiProperty({ type: () => Category, description: 'The category of the product' })
  category: Category;

  @Column({
    type: 'enum',
    enum: ['available', 'out_of_stock'],
  })
  @ApiProperty({ example: 'available', description: 'The status of the product' })
  status: 'available' | 'out_of_stock';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date of the product' })
  created_at: Date;
}