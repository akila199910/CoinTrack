import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { extractHttpExceptionPayload } from '../utils/validation.util';

// If you use TypeORM, map QueryFailedError here as well.

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx       = host.switchToHttp();
    const response  = ctx.getResponse<Response>();
    const request   = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Record<string, any> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = extractHttpExceptionPayload(exception);
      message = payload.message ?? message;
      errors  = payload.errors;
    } else {
      // Example: Prisma unique constraint -> 409 + field errors
      // if (isPrismaP2002(exception)) {
      //   status  = HttpStatus.CONFLICT;
      //   message = 'Conflict';
      //   errors  = prismaUniqueToFieldMap(exception);
      // }
      // Example: TypeORM duplicate key -> map to 409
      // else if (isTypeOrmUniqueError(exception)) { ... }
      // else keep 500
    }

    response.status(status).json({
      status: false,
      statusCode: status,
      message,
      errors: errors ?? undefined,
      path: request.url,
      method: request.method,
    });
  }
}
