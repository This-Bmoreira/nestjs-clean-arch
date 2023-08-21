import { DetailUserService } from '../../application/use_case/detail-user.service';

export class DetailUserDto implements DetailUserService.Input {
  id: string;
}
