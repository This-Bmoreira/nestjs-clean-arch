import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../../../shared/infrastructure/repository/search-repository-contracts';
import { DetailUsersService } from '../../application/use_case/detail-users.service';

export class DetailUsersDto implements DetailUsersService.Input {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Página atual' })
  page?: number;
  @IsOptional()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Itens por página' })
  perPage?: number;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Ordenação por "name" ou "createdAt"' })
  sort?: string;
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Direção da ordenação: crescente ou decrescente',
  })
  sortDir?: SortDirection;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Filtro de pesquisa' })
  filter?: string;
}
