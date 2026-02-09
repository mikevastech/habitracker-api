import { ITaskRepository } from '../../core/repositories/task.repository.interface';
import { TaskEntity, TaskType } from '../../core/entities/task.entity';
export interface CreateTaskDto {
    userId: string;
    title: string;
    taskType: TaskType;
    isPublic?: boolean;
}
export declare class CreateTaskUseCase {
    private taskRepository;
    constructor(taskRepository: ITaskRepository);
    execute(dto: CreateTaskDto): Promise<TaskEntity>;
}
