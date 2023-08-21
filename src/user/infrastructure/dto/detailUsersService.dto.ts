import { SortDirection } from '../../../shared/infrastructure/repository/search-repository-contracts';
import { DetailUsersService } from '../../application/use_case/detail-users.service';

export class DetailUsersDto implements DetailUsersService.Input {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: string;
}
