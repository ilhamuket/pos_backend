import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { AuthGuard } from '@nestjs/passport';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // Create new product
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);
  }

  // Get all products
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // Get a product by ID
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  // Update a product
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, updateData);
  }

  // Delete a product
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}