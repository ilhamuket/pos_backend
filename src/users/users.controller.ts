import { Controller, Get, Param, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { RegisterDto } from '../auth/dto/register.dto'; // Import DTO untuk register
import { CreateUserDto } from './dto/create-user.dto'; // DTO untuk create user
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Endpoint untuk mendapatkan semua pengguna
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Endpoint untuk mendapatkan pengguna berdasarkan ID
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  // Endpoint untuk mendaftar pengguna baru (register)
  @Post('register')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
