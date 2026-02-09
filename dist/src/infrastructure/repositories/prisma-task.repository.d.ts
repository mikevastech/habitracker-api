import { PrismaService } from '../prisma/prisma.service';
import { ITaskRepository } from '../../core/repositories/task.repository.interface';
import { TaskEntity, PaginatedResult } from '../../core/entities/task.entity';
export declare class PrismaTaskRepository implements ITaskRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(task: Partial<TaskEntity>): Promise<TaskEntity>;
    findById(id: string): Promise<TaskEntity | null>;
    findByUserId(userId: string, limit: number, cursor?: string): Promise<PaginatedResult<TaskEntity>>;
    update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity>;
    delete(id: string): Promise<void>;
    private mapToEntity;
}
