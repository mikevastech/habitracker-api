export declare enum TaskType {
    HABIT = "HABIT",
    ROUTINE = "ROUTINE",
    TODO = "TODO"
}
export declare enum TaskPriority {
    NONE = "NONE",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class TaskEntity {
    id: string;
    userId: string;
    categoryId?: string;
    frequencyId?: string;
    title: string;
    taskType: TaskType;
    isPublic: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    habitDetails?: any;
    routineDetails?: any;
    todoDetails?: any;
    constructor(partial: Partial<TaskEntity>);
}
export interface PaginatedResult<T> {
    data: T[];
    nextCursor?: string;
}
