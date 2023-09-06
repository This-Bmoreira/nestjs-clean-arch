import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription(
      'Node.js Rest API - NestJs, Typescript, DDD, Clean Architecture and Automated Tests',
    )
    .addBearerAuth({
      description: 'Informar o JWT para autorizar o acesso',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  applyGlobalConfig(app);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
