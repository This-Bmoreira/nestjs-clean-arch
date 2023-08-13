import { ConflictError } from '../../../../../shared/domain/erros/conflict-error';
import { NotFoundError } from '../../../../../shared/domain/erros/not-found-error';
import { InMemorySearchRepository } from '../../../../../shared/infrastructure/repository/in-memory-search-repository';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserRepository } from '../../../../domain/repository/user.repository';

export class UserInMemoryRepository
  extends InMemorySearchRepository<UserEntity>
  implements UserRepository
{
  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find((item) => item.email === email);
    if (!entity) {
      throw new NotFoundError('Entity not found using email');
    }
    return entity;
  }
  async checkEmailExists(email: string): Promise<void> {
    const entity = this.items.find((item) => item.email === email);
    if (entity) {
      throw new ConflictError('Entity not found using email');
    }
  }
}
