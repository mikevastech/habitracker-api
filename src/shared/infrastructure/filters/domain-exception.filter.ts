import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/errors/domain.exceptions';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpException = this.toHttpException(exception);
    const status = httpException.getStatus();
    const body = httpException.getResponse();
    response.status(status).json(typeof body === 'object' ? body : { message: body });
  }

  private toHttpException(exception: DomainException) {
    switch (exception.code) {
      case 'NotFound':
        return new NotFoundException(exception.message);
      case 'Forbidden':
        return new ForbiddenException(exception.message);
      case 'Validation':
        return new BadRequestException(exception.message);
      case 'Conflict':
        return new ConflictException(exception.message);
      case 'Unauthorized':
        return new UnauthorizedException(exception.message);
      case 'Internal':
      default:
        return new InternalServerErrorException(exception.message);
    }
  }
}
