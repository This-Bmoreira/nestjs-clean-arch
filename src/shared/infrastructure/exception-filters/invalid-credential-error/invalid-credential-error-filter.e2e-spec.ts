import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { InvalidCredentialsError } from '../../../../user/application/error/invalid-credentials-error';
import { InvalidCredentialErrorFilter } from './invalid-credential-error-filter';
@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError('Invalid credentials');
  }
}

describe('InvalidCredentialsErrorFilter e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new InvalidCredentialErrorFilter());
    await app.init();
  });

  it('should be defined', () => {
    expect(new InvalidCredentialErrorFilter()).toBeDefined();
  });

  it('should catch a InvalidCredentialsError', () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid credentials',
    });
  });
});
