import { UserRepository } from '../../domain/repository/user.repository';
import { OutputUser } from '../dto/output-user.dto';

export namespace DetailUserService {
  export type Input = {
    id: string;
  };

  export type Output = OutputUser;

  export class UserProfile {
    constructor(private userRepository: UserRepository.Repository) {}

    async findOne(input: Input): Promise<Output> {
      const entity = await this.userRepository.findOne(input.id);
      return entity.toJSON();
    }
  }
}
