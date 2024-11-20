// src/categories/category.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The unique identifier of the category' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Category Name', description: 'The name of the category' })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date of the category' })
  created_at: Date;
}