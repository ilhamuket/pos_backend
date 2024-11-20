// src/categories/categories.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.', type: [Category] })
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Return the category.', type: Category })
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.', type: Category })
  @ApiBody({ type: Category })
  @UseGuards(AuthGuard('jwt'))
  create(@Body() category: Category): Promise<Category> {
    return this.categoriesService.create(category);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({ status: 200, description: 'The category has been successfully updated.', type: Category })
  @ApiBody({ type: Category })
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: number, @Body() category: Category): Promise<Category> {
    return this.categoriesService.update(id, category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}