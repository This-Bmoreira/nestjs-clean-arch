import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';

import { applyGlobalConfig } from '../../../../global-config';
import { DatabaseModule } from '../../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../../shared/infrastructure/database/setup/prisma-test';
import { EnvConfigModule } from '../../../../shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UserDataBuilder } from '../../../domain/testing/helpers/user-data-builder';
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
  });

  beforeEach(async () => {
    updateUserDto = {
      name: 'any_name',
    };

    await prismaService.user.deleteMany();
    entity = new UserEntity(UserDataBuilder({}));
    await repository.create(entity);
  });

  describe('POST /user/:id', () => {
    it('should create a user successfully', async () => {
      updateUserDto.name = 'new_name';
      const res = await request(app.getHttpServer())
        .put(`/user/${entity._id}`)
        .send(updateUserDto)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const user = await repository.findOne(entity.id);
      const presenter = UserController.userToResponse(user.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toStrictEqual(serialized);
    });
    it('should return 422 when sending invalid data', async () => {
      const res = await request(app.getHttpServer())
        .put(`/user/${entity._id}`)
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });
    it('should return 422 when name is missing', async () => {
      const res = await request(app.getHttpServer())
        .put('/user/fake_id')
        .send(updateUserDto)
        .expect(404);
      console.log(res.body);
      expect({
        statusCode: 404,
        error: 'Not Found',
        message: 'UserModel not found using ID fake_id',
      });
    });
  });
});
