"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const swagger_config_1 = require("./swagger.config");
const logging_interceptor_1 = require("./shared/infrastructure/logging/logging.interceptor");
const request_logger_middleware_1 = require("./shared/infrastructure/logging/request-logger.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        ...(process.env.NODE_ENV !== 'production' && {
            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        }),
    });
    if (process.env.NODE_ENV !== 'production') {
        app.use(request_logger_middleware_1.requestLoggerMiddleware);
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = (0, swagger_config_1.getSwaggerConfig)();
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