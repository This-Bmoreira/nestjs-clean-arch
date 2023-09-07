import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignupService } from '../../application/use_case/signup.service';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto implements SignupService.Input {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nome do usuário' })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Senha do usuário' })
  password: string;
}
