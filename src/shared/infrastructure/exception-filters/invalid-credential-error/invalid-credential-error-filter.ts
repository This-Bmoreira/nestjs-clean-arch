import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InvalidCredentialsError } from '../../../../user/application/error/invalid-credentials-error';
import { FastifyReply } from 'fastify';
@Catch(InvalidCredentialsError)
export class InvalidCredentialErrorFilter implements ExceptionFilter {
  catch(exception: InvalidCredentialsError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: exception.message,
    });
  }
}
