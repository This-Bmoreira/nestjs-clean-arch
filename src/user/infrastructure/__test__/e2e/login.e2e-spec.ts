import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

import { applyGlobalConfig } from '../../../../global-config';
import { HashingService } from '../../../../shared/application/provider/hash-provider';
import { DatabaseModule } from '../../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../../shared/infrastructure/database/setup/prisma-test';
import { EnvConfigModule } from '../../../../shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UserDataBuilder } from '../../../domain/testing/helpers/user-data-builder';
import { BcryptPasswordHasher } from '../../../provider/hash-provider/bcryptjs-hash-provider';
import { SignInDto } from '../../dto/signin.dto';
import { UserModule } from '../../user.module';

describe('login End-to-End Tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let signInDto: SignInDto;
  let hashProvider: HashingService;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTest();

    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UserModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    repository = module.get<UserRepository.Repository>('UserRepository');
    hashProvider = new BcryptPasswordHasher();
  });

  beforeEach(async () => {
    signInDto = {
      email: 'any@any.com',
      password: 'any_password',
    };

    await prismaService.user.deleteMany();
  });

  describe('POST /user/login', () => {
    it('should authenticate a user successfully', async () => {
      const passwordHash = await hashProvider.generateHash(signInDto.password);
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signInDto.email,
        password: passwordHash,
      });
      await repository.create(entity);
      const res = await request(app.getHttpServer())
        .post('/user/login')
        .send(signInDto)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['accessToken']);
      expect(typeof res.body.accessToken).toEqual('string');
    });

    it('should return 422 when sending invalid data', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/login')
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should return 422 when password is missing', async () => {
      delete signInDto.password;
      const res = await request(app.getHttpServer())
        .post('/user/login')
        .send(signInDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should return 422 when email is missing', async () => {
      delete signInDto.email;
      const res = await request(app.getHttpServer())
        .post('/user/login')
        .send(signInDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ]);
    });

    it('should return 404 when email is already in use', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: 'fake@fake.com', password: 'fake' })
        .expect(404);

      expect(res.body.error).toBe('Not Found');
      expect(res.body.message).toEqual(
        'UserModel not found using email fake@fake.com',
      );
    });

    it('should return 400 when password is incorrect ', async () => {
      const passwordHash = await hashProvider.generateHash(signInDto.password);
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signInDto.email,
        password: passwordHash,
      });
      await repository.create(entity);
      await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: signInDto.email, password: 'fake' })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad request',
          message: 'Invalid credentials',
        });
    });
  });
});
