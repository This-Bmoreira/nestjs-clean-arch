import { IsNotEmpty, IsString } from 'class-validator';
import { PasswordModificationService } from '../../application/use_case/modify-password.service';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordModificationDto
  implements Omit<PasswordModificationService.Input, 'id'>
{
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'nova senha do usuário' })
  password: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'senha atual do usuário' })
  oldPassword: string;
}
