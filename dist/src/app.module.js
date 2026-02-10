"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
const core_1 = require("@nestjs/core");
const analytics_module_1 = require("./shared/infrastructure/analytics/analytics.module");
const prisma_module_1 = require("./shared/infrastructure/prisma/prisma.module");
const redis_module_1 = require("./shared/infrastructure/redis/redis.module");
const profile_module_1 = require("./modules/profile/profile.module");
const suggestions_queue_module_1 = require("./modules/profile/infrastructure/queue/suggestions-queue.module");
const task_module_1 = require("./modules/task/task.module");
const auth_module_1 = require("./modules/auth/auth.module");
const community_module_1 = require("./modules/community/community.module");
const notification_module_1 = require("./modules/notification/notification.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const upload_module_1 = require("./modules/upload/upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [redis_module_1.RedisModule],
                inject: ['REDIS_CLIENT'],
                useFactory: (redis) => ({
                    throttlers: [
                        { name: 'short', ttl: 1000, limit: 10 },
                        { name: 'medium', ttl: 10_000, limit: 50 },
                        { name: 'long', ttl: 60_000, limit: 200 },
                    ],
                    storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(redis),
                }),
            }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            analytics_module_1.AnalyticsModule,
            auth_module_1.AuthModule,
            task_module_1.TaskModule,
            profile_module_1.ProfileModule,
            suggestions_queue_module_1.SuggestionsQueueModule,
            community_module_1.CommunityModule,
            notification_module_1.NotificationModule,
            gamification_module_1.GamificationModule,
            upload_module_1.UploadModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map