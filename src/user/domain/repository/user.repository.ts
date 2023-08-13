import { SearchRepositoryInterface } from '../../../shared/infrastructure/repository/search-repository-contracts';
import { UserEntity } from '../entities/user.entity';

export interface UserRepository
  extends SearchRepositoryInterface<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>;
  checkEmailExists(email: string): Promise<void>;
}
