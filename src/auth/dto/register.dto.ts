import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  password: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  email: string;
}