import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { getSwaggerConfig } from './swagger.config';
import { LoggingInterceptor } from './shared/infrastructure/logging/logging.interceptor';
import { requestLoggerMiddleware } from './shared/infrastructure/logging/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    ...(process.env.NODE_ENV !== 'production' && {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    }),
  });

  if (process.env.NODE_ENV !== 'production') {
    app.use(requestLoggerMiddleware); // first: log every request (incl. POST) before guards
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

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
  // Swagger UI: /api/docs | OpenAPI JSON: /api/docs-json
  SwaggerModule.setup('api/docs', app, document);

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(err);
});
