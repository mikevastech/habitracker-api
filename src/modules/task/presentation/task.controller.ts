import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskUseCase, CreateTaskDto } from '../application/create-task.use-case';

@Controller('tasks')
export class TaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.createTaskUseCase.execute(createTaskDto);
  }

  // Add more endpoints as needed
}
