import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  // Cari semua pengguna
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }


  // Cari pengguna berdasarkan ID
  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Cari pengguna berdasarkan email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Membuat pengguna baru (register)
  async createUser(username: string, email: string, password: string): Promise<User> {
    console.log('Creating user with:', { username, email, password }); // Log data received
    if (!password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({ username, email, password: hashedPassword });
    return this.usersRepository.save(newUser);
  }
  
  // Menghapus pengguna berdasarkan ID
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
