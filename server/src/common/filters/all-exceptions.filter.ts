import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: any = {
      status: false,
      message: 'Internal server error',
      errors: { _generic: ['Internal server error'] },
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse(); 

      if (typeof payload === 'string') {
        body = {
          status: false,
          message: payload,
          errors: { _generic: [payload] },
        };
      } else {
        
        const { message, errors } = payload as any;
        body = {
          status: false,
          message: Array.isArray(message) ? 'Bad Request' : message ?? 'Error',
          errors: normalizeErrors(payload),
        };
      }
    } else {
      const msg = (exception as any)?.message ?? 'Internal server error';
      body = {
        status: false,
        message: msg,
        errors: { _generic: [msg] },
      };
    }

    return res.status(status).json(body);
  }
}

function normalizeErrors(payload: any) {
  
  if (payload?.errors && typeof payload.errors === 'object') {
    return payload.errors;
  }
  
  if (Array.isArray(payload?.message)) {
    return { _generic: payload.message };
  }
  if (typeof payload?.message === 'string') {
    return { _generic: [payload.message] };
  }
  return { _generic: ['Error'] };
}
