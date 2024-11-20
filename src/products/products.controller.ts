// src/products/products.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.', type: [Product] })
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Return the product.', type: Product })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: Product })
  @ApiBody({ type: Product })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() product: Product): Promise<Product> {
    return this.productsService.create(product);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.', type: Product })
  @ApiBody({ type: Product })
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: number, @Body() product: Product): Promise<Product> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}