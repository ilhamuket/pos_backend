import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  password: string;

  @ApiProperty({ example: 1 })
  remember_me: number;
}