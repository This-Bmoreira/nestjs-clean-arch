import { SignupService } from '../../application/use_case/signup.service';

export class SignupDto implements SignupService.Input {
  name: string;
  email: string;
  password: string;
}
