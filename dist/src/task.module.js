"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const common_1 = require("@nestjs/common");
const task_repository_interface_1 = require("./core/repositories/task.repository.interface");
const prisma_task_repository_1 = require("./infrastructure/repositories/prisma-task.repository");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const task_controller_1 = require("./presentation/controllers/task.controller");
const create_task_use_case_1 = require("./application/use-cases/create-task.use-case");
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [task_controller_1.TaskController],
        providers: [
            create_task_use_case_1.CreateTaskUseCase,
            {
                provide: task_repository_interface_1.ITaskRepository,
                useClass: prisma_task_repository_1.PrismaTaskRepository,
            },
        ],
        exports: [task_repository_interface_1.ITaskRepository],
    })
], TaskModule);
//# sourceMappingURL=task.module.js.map