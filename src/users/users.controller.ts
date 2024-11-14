import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { RegisterDto } from '../auth/dto/register.dto'; // Import DTO untuk register
import { CreateUserDto } from './dto/create-user.dto'; // DTO untuk create user

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Endpoint untuk mendapatkan semua pengguna
  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Endpoint untuk mendapatkan pengguna berdasarkan ID
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  // Endpoint untuk mendaftar pengguna baru (register)
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    const { username, email, password } = registerDto;
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      throw new Error('User with this email already exists');
    }
    return this.usersService.createUser(username, email, password);
  }

  // Endpoint untuk menghapus pengguna
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
