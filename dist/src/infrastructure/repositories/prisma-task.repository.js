"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTaskRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const task_entity_1 = require("../../core/entities/task.entity");
let PrismaTaskRepository = class PrismaTaskRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(task) {
        const created = await this.prisma.task.create({
            data: {
                userId: task.userId,
                title: task.title,
                taskType: task.taskType,
                isPublic: task.isPublic ?? false,
            },
            include: {
                habitDetails: true,
                routineDetails: true,
                todoDetails: true,
            },
        });
        return this.mapToEntity(created);
    }
    async findById(id) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                habitDetails: true,
                routineDetails: true,
                todoDetails: true,
            },
        });
        if (!task)
            return null;
        return this.mapToEntity(task);
    }
    async findByUserId(userId, limit, cursor) {
        const take = limit + 1;
        const tasks = await this.prisma.task.findMany({
            where: { userId, isDeleted: false },
            take: take,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
            orderBy: { createdAt: 'desc' },
            include: {
                habitDetails: true,
                routineDetails: true,
                todoDetails: true,
            },
        });
        const hasNextPage = tasks.length > limit;
        const items = hasNextPage ? tasks.slice(0, limit) : tasks;
        const nextCursor = hasNextPage ? items[items.length - 1].id : undefined;
        return {
            data: items.map((t) => this.mapToEntity(t)),
            nextCursor,
        };
    }
    async update(id, task) {
        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                title: task.title,
                isPublic: task.isPublic,
                isDeleted: task.isDeleted,
            },
            include: {
                habitDetails: true,
                routineDetails: true,
                todoDetails: true,
            },
        });
        return this.mapToEntity(updated);
    }
    async delete(id) {
        await this.prisma.task.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
    mapToEntity(prismaTask) {
        return new task_entity_1.TaskEntity({
            ...prismaTask,
            taskType: prismaTask.taskType,
        });
    }
};
exports.PrismaTaskRepository = PrismaTaskRepository;
exports.PrismaTaskRepository = PrismaTaskRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaTaskRepository);
//# sourceMappingURL=prisma-task.repository.js.map