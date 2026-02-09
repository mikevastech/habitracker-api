import { CreateTaskDto, CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
export declare class TaskController {
    private createTaskUseCase;
    constructor(createTaskUseCase: CreateTaskUseCase);
    create(createTaskDto: CreateTaskDto): Promise<import("../../core/entities/task.entity").TaskEntity>;
}
