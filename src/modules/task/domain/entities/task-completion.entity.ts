export class TaskCompletionEntity {
  id!: string;
  taskId!: string;
  completedAt!: Date;
  value!: number | null;
  status!: string | null;
  notes!: string | null;
  description!: string | null;

  constructor(partial: Partial<TaskCompletionEntity>) {
    Object.assign(this, partial);
  }
}
