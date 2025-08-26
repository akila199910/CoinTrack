import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    return next.handle().pipe(
      map((data: any) => ({
        status: true,
        statusCode: res.statusCode ?? 200,
        message: data?.message ?? 'OK',
        data,
      })),
    );
  }
}
