"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEntity = exports.TaskPriority = exports.TaskType = void 0;
var TaskType;
(function (TaskType) {
    TaskType["HABIT"] = "HABIT";
    TaskType["ROUTINE"] = "ROUTINE";
    TaskType["TODO"] = "TODO";
})(TaskType || (exports.TaskType = TaskType = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["NONE"] = "NONE";
    TaskPriority["LOW"] = "LOW";
    TaskPriority["MEDIUM"] = "MEDIUM";
    TaskPriority["HIGH"] = "HIGH";
    TaskPriority["URGENT"] = "URGENT";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
class TaskEntity {
    id;
    userId;
    categoryId;
    frequencyId;
    title;
    taskType;
    isPublic;
    isDeleted;
    createdAt;
    updatedAt;
    habitDetails;
    routineDetails;
    todoDetails;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.TaskEntity = TaskEntity;
//# sourceMappingURL=task.entity.js.map