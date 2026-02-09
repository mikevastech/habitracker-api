"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=main.js.map