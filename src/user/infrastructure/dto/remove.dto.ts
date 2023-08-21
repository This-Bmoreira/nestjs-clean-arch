import { RemoveUserService } from '../../application/use_case/remove-user.service';

export class RemoveDto implements RemoveUserService.Input {
  id: string;
}
