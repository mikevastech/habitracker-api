import { Injectable, Inject } from '@nestjs/common';
import {
  IReferenceRepository,
  CreateUnitData,
} from '../domain/repositories/reference.repository.interface';
import { TaskUnitEntity } from '../domain/entities/reference.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface CreateUnitParams {
  userId: string;
  data: CreateUnitData;
}

@Injectable()
export class CreateUnitUseCase implements IUseCase<TaskUnitEntity, CreateUnitParams> {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(params: CreateUnitParams): Promise<TaskUnitEntity> {
    return this.referenceRepository.createUnit(params.userId, params.data);
  }
}
