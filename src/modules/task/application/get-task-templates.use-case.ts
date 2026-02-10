import { Injectable, Inject } from '@nestjs/common';
import {
  IReferenceRepository,
  TaskTemplateItem,
} from '../domain/repositories/reference.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import { NoParams } from '../../../shared/domain/ports/use-case.port';

@Injectable()
export class GetTaskTemplatesUseCase implements IUseCase<TaskTemplateItem[], NoParams> {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(_params: NoParams): Promise<TaskTemplateItem[]> {
    return this.referenceRepository.findPredefinedTaskTemplates();
  }
}
