import { Entity } from '../../domain/entities/entity';
import { InMemoryRepository } from './in-memory-repository';
import { SearchRepositoryInterface } from './search-repository-contracts';

export abstract class InMemorySearchRepository<E extends Entity<unknown>>
  extends InMemoryRepository<E>
  implements SearchRepositoryInterface<E, any, any>
{
  search(props: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
