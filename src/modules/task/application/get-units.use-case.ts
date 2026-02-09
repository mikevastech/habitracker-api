import { Injectable, Inject } from '@nestjs/common';
import { IReferenceRepository } from '../domain/repositories/reference.repository.interface';
import { TaskUnitEntity } from '../domain/entities/reference.entity';

@Injectable()
export class GetUnitsUseCase {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(): Promise<TaskUnitEntity[]> {
    return this.referenceRepository.findPredefinedUnits();
  }
}
