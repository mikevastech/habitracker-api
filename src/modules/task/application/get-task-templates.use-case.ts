import { Injectable, Inject } from '@nestjs/common';
import {
  IReferenceRepository,
  TaskTemplateItem,
} from '../domain/repositories/reference.repository.interface';

@Injectable()
export class GetTaskTemplatesUseCase {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(): Promise<TaskTemplateItem[]> {
    return this.referenceRepository.findPredefinedTaskTemplates();
  }
}
