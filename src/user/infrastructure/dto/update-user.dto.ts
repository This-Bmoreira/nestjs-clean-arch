import { ModifyUserService } from '../../application/use_case/modify-user.service';

export class UpdateUserDto implements Omit<ModifyUserService.Input, 'id'> {
  name: string;
}
