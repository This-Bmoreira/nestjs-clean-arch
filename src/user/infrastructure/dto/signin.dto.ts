import { SignInService } from '../../application/use_case/signin.service';

export class SignInDto implements SignInService.Input {
  email: string;
  password: string;
}
