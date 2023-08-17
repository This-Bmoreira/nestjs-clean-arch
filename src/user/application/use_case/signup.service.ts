import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repository/user.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { BadRequestError } from '../error/bad-request-error';

export namespace SignupService {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  };

  export class Create {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: BcryptPasswordHasher,
    ) {}

    async executeSignup(input: Input): Promise<Output> {
      const { email, name, password } = input;
      if (!email || !name || !password) {
        throw new BadRequestError('input data not provided');
      }

      await this.userRepository.emailExists(email);

      const hashPassword = await this.hashProvider.generateHash(password);

      const entity = new UserEntity(
        Object.assign(input, { password: hashPassword }),
      );

      await this.userRepository.create(entity);

      return entity.toJSON();
    }
  }
}
