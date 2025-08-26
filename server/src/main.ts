import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { formatValidationErrors } from './common/utils/validation.util';
import cookieParser from "cookie-parser";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    app.setGlobalPrefix('/api/v1');

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => formatValidationErrors(errors),
    }));
  

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
