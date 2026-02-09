import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Habit Tracker API')
    .setDescription('API for habit tracking, community, challenges and gamification')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication (Better Auth)')
    .addTag('profile', 'Profile, settings, follow, suggestions')
    .addTag('tasks', 'Tasks and completions')
    .addTag('posts', 'Posts, feed, comments, likes')
    .addTag('groups', 'Groups and members')
    .addTag('challenges', 'Challenges and progress')
    .addTag('notifications', 'User notifications')
    .addTag('gamification', 'Rewards and achievements')
    .addTag('upload', 'Image upload (Cloudinary)')
    .build();
  const document = SwaggerModule.createDocument(app, config);
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
