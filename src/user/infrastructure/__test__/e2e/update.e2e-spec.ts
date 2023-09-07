import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
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
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserController } from '../../user.controller';
import { UserModule } from '../../user.module';

describe('UserController e2e test', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updateUserDto: UpdateUserDto;
  const prismaService = new PrismaClient();
  let entity: UserEntity;
  let hashProvider: HashingService;
  let hashPassword: string;
  let accessToken: string;

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
    hashPassword = await hashProvider.generateHash('123');
  });

  beforeEach(async () => {
    updateUserDto = {
      name: 'any_name',
    };
    await prismaService.user.deleteMany();
    entity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    );
    await repository.create(entity);
    const LoginResponse = await request(app.getHttpServer())
      .post('/user/login')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: 'a@a.com', password: '123' })
      .expect(HttpStatus.OK);
    accessToken = LoginResponse.body.accessToken;
  });

  describe('PUT /user/:id', () => {
    it('should update a user successfully', async () => {
      updateUserDto.name = 'new_name';
      const res = await request(app.getHttpServer())
        .put(`/user/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(HttpStatus.OK);

      expect(res.body).toHaveProperty('data');

      const updatedUser = await repository.findOne(entity.id);
      const presenter = UserController.userToResponse(updatedUser.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toEqual(serialized);
    });

    it('should return 422 for invalid data', async () => {
      const res = await request(app.getHttpServer())
        .put(`/user/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('should return 404 when user is not found', async () => {
      const fakeUserId = 'fake_id';
      const res = await request(app.getHttpServer())
        .put(`/user/${fakeUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `UserModel not found using ID ${fakeUserId}`,
      });
    });
    it('should return 401 when user is not authorized', async () => {
      const fakeUserId = 'fake_id';
      const res = await request(app.getHttpServer())
        .put(`/user/${fakeUserId}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `Unauthorized`,
      });
    });
  });
});
