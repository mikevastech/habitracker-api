import { Injectable, Inject } from '@nestjs/common';
import {
  IReferenceRepository,
  CreateUnitData,
} from '../domain/repositories/reference.repository.interface';
import { TaskUnitEntity } from '../domain/entities/reference.entity';

@Injectable()
export class CreateUnitUseCase {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(userId: string, data: CreateUnitData): Promise<TaskUnitEntity> {
    return this.referenceRepository.createUnit(userId, data);
  }
}
