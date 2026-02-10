import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './swagger.config';
import { LoggingInterceptor } from './shared/infrastructure/logging/logging.interceptor';
import { requestLoggerMiddleware } from './shared/infrastructure/logging/request-logger.middleware';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter';
import { SentryExceptionFilter } from './shared/infrastructure/filters/sentry-exception.filter';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: 1.0,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    ...(process.env.NODE_ENV !== 'production' && {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    }),
  });

  app.use(helmet());

  app.use(requestLoggerMiddleware);
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new SentryExceptionFilter(), new DomainExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(err);
});
