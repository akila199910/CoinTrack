import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { status: boolean; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ status: boolean; data: T }> {
    return next.handle().pipe(
      map((data) => ({
        status: true,
        data,
      })),
    );
  }
}
