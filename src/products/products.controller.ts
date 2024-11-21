// src/products/products.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import ProductStatus from './product-status.enum';


@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get list of products with pagination and search' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'query', required: false, type: String, description: 'Search query', example: 'product' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProductStatus, // Enum digunakan untuk menghasilkan dropdown
    description: 'Status Filter',
    example: ProductStatus.AVAILABLE, // Contoh default
  })
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('query') query: string = '',
    @Query('status') status: ProductStatus = ProductStatus.AVAILABLE // Pilihan enum
  ) {
    if (page < 1 || limit < 1) {
      throw new HttpException('Page and limit must be positive numbers', HttpStatus.BAD_REQUEST);
    }
    const products = await this.productsService.searchProducts(query, [status], page, limit);
    return {
      statusCode: HttpStatus.OK,
      data: products.data,
      currentPage: products.currentPage,
      itemsPerPage: products.itemsPerPage,
      totalItems: products.totalItems,
      totalPages: products.totalPages,
    };
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all products' })
  // @ApiResponse({ status: 200, description: 'Return all products.', type: [Product] })
  // @UseGuards(AuthGuard('jwt'))
  // findAll(): Promise<Product[]> {
  //   return this.productsService.findAll();
  // }

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
  @ApiBody({ type: CreateProductDto })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.', type: Product })
  @ApiBody({ type: CreateProductDto })
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: number, @Body() updateProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 200, description: 'The product has been successfully deleted.' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}