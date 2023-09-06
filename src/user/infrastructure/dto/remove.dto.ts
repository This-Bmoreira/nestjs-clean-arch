import { IsNotEmpty, IsString } from 'class-validator';
import { RemoveUserService } from '../../application/use_case/remove-user.service';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveDto implements RemoveUserService.Input {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'id do usuário' })
  id: string;
}
