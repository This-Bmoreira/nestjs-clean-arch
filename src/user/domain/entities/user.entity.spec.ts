import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from './user.entity';

describe('UserEntity unit test', () => {
  let sut: UserEntity;
  let props: UserProps;

  beforeEach(() => {
    props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    sut = new UserEntity(props);
  });

  describe('Constructor method', () => {
    it('should set the correct name', () => {
      expect(sut.props.name).toEqual(props.name);
    });

    it('should set the correct email', () => {
      expect(sut.props.email).toEqual(props.email);
    });

    it('should set the correct password', () => {
      expect(sut.props.password).toEqual(props.password);
    });

    it('should set createAt property to an instance of Date', () => {
      expect(sut.props.createAt).toBeInstanceOf(Date);
    });
  });
});
