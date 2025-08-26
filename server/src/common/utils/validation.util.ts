import { BadRequestException, HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function toFieldErrorMap(validationErrors: ValidationError[]) {
  const errors: Record<string, string | string[]> = {};

  const walk = (errs: ValidationError[], parent?: string) => {
    for (const err of errs) {
      const field = parent ? `${parent}.${err.property}` : err.property;
      if (err.constraints) {
        const msgs = Object.values(err.constraints);
        errors[field] = msgs.length === 1 ? msgs[0] : msgs;
      }
      if (err.children?.length) walk(err.children, field);
    }
  };

  walk(validationErrors);
  return errors;
}

export function formatValidationErrors(errors: ValidationError[]): HttpException {
  return new BadRequestException({
    status: false,
    statusCode: 400,
    message: 'Validation failed',
    errors: toFieldErrorMap(errors),
  });
}

export function extractHttpExceptionPayload(exception: HttpException): { message: string; errors?: Record<string, any> } {
  const resp = exception.getResponse();
  if (typeof resp === 'string') {
    return { message: resp };
  }
  const message = Array.isArray(resp['message'])
    ? resp['message'].join(', ')
    : resp['message'] ?? resp['error'] ?? 'Error';
  const errors = resp['errors'];
  return { message, errors };
}
