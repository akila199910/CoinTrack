import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('/api/v1');
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        
        const errors: Record<string, string[]> = {};

        const walk = (err: ValidationError, parent = '') => {
          const key = parent ? `${parent}.${err.property}` : err.property;

          if (err.constraints) {
            errors[key] = Object.values(err.constraints);
          }

            if (err.children && err.children.length) {
              err.children.forEach(child => walk(child, key));
            }
          };

            validationErrors.forEach(e => walk(e));

            return new BadRequestException({
              message: 'Validation failed',
              errors, 
            });
          },
        }),
      );

    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

     app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    credentials: true,            
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
