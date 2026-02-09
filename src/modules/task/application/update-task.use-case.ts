import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import {
  TaskEntity,
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
} from '../domain/entities/task.entity';

export interface UpdateTaskDto {
  title?: string;
  categoryId?: string | null;
  iconName?: string | null;
  colorValue?: number | null;
  imageUrl?: string | null;
  isPublic?: boolean;
  // type-specific (optional)
  goalValue?: number;
  currentValue?: number;
  unitId?: string | null;
  direction?: string;
  steps?: string[];
  startTime?: string | null;
  dueTime?: Date | null;
  priority?: string;
  isFlagged?: boolean;
  url?: string | null;
  affirmation?: string | null;
  durationMinutes?: number | null;
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string, userId: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const existing = await this.taskRepository.findById(taskId);
    if (!existing) throw new NotFoundException('Task not found');
    if (existing.userId !== userId) throw new ForbiddenException('Not allowed to update this task');

    const merged = this.merge(existing, dto);
    return this.taskRepository.update(taskId, merged);
  }

  private merge(existing: TaskEntity, dto: UpdateTaskDto): TaskEntity {
    const base = {
      ...existing,
      title: dto.title ?? existing.title,
      categoryId: dto.categoryId !== undefined ? dto.categoryId : existing.categoryId,
      iconName: dto.iconName !== undefined ? dto.iconName : existing.iconName,
      colorValue: dto.colorValue !== undefined ? dto.colorValue : existing.colorValue,
      imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : existing.imageUrl,
      isPublic: dto.isPublic !== undefined ? dto.isPublic : existing.isPublic,
    };

    switch (existing.taskType) {
      case TaskType.HABIT: {
        const e = existing as HabitEntity;
        return new HabitEntity({
          ...base,
          goalValue: dto.goalValue ?? e.goalValue,
          currentValue: dto.currentValue ?? e.currentValue,
          unitId: dto.unitId !== undefined ? dto.unitId : e.unitId,
          direction: (dto.direction as HabitEntity['direction']) ?? e.direction,
        });
      }
      case TaskType.ROUTINE: {
        const e = existing as RoutineEntity;
        return new RoutineEntity({
          ...base,
          steps: dto.steps ?? e.steps,
          startTime: dto.startTime !== undefined ? dto.startTime : e.startTime,
        });
      }
      case TaskType.TODO: {
        const e = existing as TodoEntity;
        return new TodoEntity({
          ...base,
          dueTime: dto.dueTime !== undefined ? dto.dueTime : e.dueTime,
          priority: (dto.priority as TodoEntity['priority']) ?? e.priority,
          isFlagged: dto.isFlagged ?? e.isFlagged,
          url: dto.url !== undefined ? dto.url : e.url,
        });
      }
      case TaskType.MINDSET: {
        const e = existing as MindsetEntity;
        return new MindsetEntity({
          ...base,
          affirmation: dto.affirmation !== undefined ? dto.affirmation : e.affirmation,
          durationMinutes:
            dto.durationMinutes !== undefined ? dto.durationMinutes : e.durationMinutes,
        });
      }
      default:
        return existing;
    }
  }
}
