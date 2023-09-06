import { IsString } from 'class-validator';
import { DetailUserService } from '../../application/use_case/detail-user.service';
import { ApiProperty } from '@nestjs/swagger';

export class DetailUserDto implements DetailUserService.Input {
  @IsString()
  @ApiProperty({ description: 'ID do  do usuário' })
  id: string;
}
