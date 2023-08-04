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
  describe('Getter methods', () => {
    it('should return the correct name', () => {
      const name = sut.props.name;
      expect(name).toBeDefined();
      expect(name).toEqual(props.name);
      expect(typeof name).toEqual('string');
    });

    it('should return the correct email', () => {
      const email = sut.props.email;
      expect(email).toBeDefined();
      expect(email).toEqual(props.email);
      expect(typeof email).toEqual('string');
    });

    it('should return the correct password', () => {
      const password = sut.props.password;
      expect(password).toBeDefined();
      expect(password).toEqual(props.password);
      expect(typeof password).toEqual('string');
    });
  });
  describe('createAt property', () => {
    it('should be defined', () => {
      expect(sut.props.createAt).toBeDefined();
    });
    it('should be an instance of Date', () => {
      expect(sut.props.createAt).toBeInstanceOf(Date);
    });
  });
});
