import { PasswordModificationService } from '../../application/use_case/modify-password.service';

export class PasswordModificationDto
  implements Omit<PasswordModificationService.Input, 'id'>
{
  password: string;
  oldPassword: string;
}
