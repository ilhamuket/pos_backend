import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from 'src/categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import ProductStatus from './product-status.enum'; // Adjust the path as necessary

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  async searchProducts(query: string, status: ProductStatus[], page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [result, total] = await this.productsRepository.findAndCount({
      where: {
        name: Like(`%${query}%`), // Pastikan pencarian berdasarkan nama produk
        status: In(status),
      },
      take: limit,
      skip: skip,
    });

    return {
      data: result,
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Create product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { category_id, ...productData } = createProductDto;
    const category = await this.categoriesRepository.findOne({ where: { id: category_id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }
    const product = this.productsRepository.create({ ...productData, category_id });
    return await this.productsRepository.save(product);
  }

  // Read all products
  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  // Read product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Update product
  async update(id: number, updateData: Partial<Product>): Promise<Product> {
    if (updateData.category_id) {
      const category = await this.categoriesRepository.findOne({ where: { id: updateData.category_id } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateData.category_id} not found`);
      }
    }
    await this.productsRepository.update(id, updateData);
    const updatedProduct = await this.findOne(id);
    return updatedProduct;
  }

  // Delete product
  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async getProducts(page: number, limit: number, name?: string, stockStatus?: string) {
    const offset = (page - 1) * limit;
    const query = this.productsRepository.createQueryBuilder('product')
      .skip(offset)
      .take(limit);

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }



    const products = await query.getMany();
    return products;
  }

  // async getProductByCode(code: string) {
  //   const product = await this.productsRepository.findOne({ where: { code } });
  //   if (!product) {
  //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //   }
  //   return product;
  // }

  // async updateExistingProducts() {
  //   const products = await this.productsRepository.find();
  //   for (const product of products) {
  //     if (!product.code) {
  //       product.code = this.generateSKU(product.name);
  //       await this.productsRepository.save(product);
  //     }
  //   }
  // }

  // private generateSKU(name: string): string {
  //   const initials = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  //   const uniqueNumber = Date.now().toString().slice(-6); // Generate a unique number based on timestamp
  //   return `${initials}-${uniqueNumber}`;
  // }
}
