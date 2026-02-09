import { Inject, Injectable } from '@nestjs/common';
import { IsEnum, MinLength, MaxLength } from 'class-validator';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import {
  TaskEntity,
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
} from '../domain/entities/task.entity';

export class CreateTaskDto {
  userId!: string;
  @MinLength(1)
  @MaxLength(200)
  title!: string;
  @IsEnum(TaskType)
  taskType!: TaskType;
  isPublic?: boolean;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private taskRepository: ITaskRepository,
  ) {}

  async execute(dto: CreateTaskDto): Promise<TaskEntity> {
    let task: TaskEntity;

    const baseData = {
      userId: dto.userId,
      title: dto.title,
      isPublic: dto.isPublic,
    };

    switch (dto.taskType) {
      case TaskType.HABIT:
        task = new HabitEntity(baseData);
        break;
      case TaskType.ROUTINE:
        task = new RoutineEntity(baseData);
        break;
      case TaskType.TODO:
        task = new TodoEntity(baseData);
        break;
      case TaskType.MINDSET:
        task = new MindsetEntity(baseData);
        break;
      default:
        throw new Error(`Unsupported task type: ${String(dto.taskType)}`);
    }

    return this.taskRepository.create(task);
  }
}
