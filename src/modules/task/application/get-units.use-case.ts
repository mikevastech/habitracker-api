import { Injectable, Inject } from '@nestjs/common';
import { IReferenceRepository } from '../domain/repositories/reference.repository.interface';
import { TaskUnitEntity } from '../domain/entities/reference.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import { NoParams } from '../../../shared/domain/ports/use-case.port';

@Injectable()
export class GetUnitsUseCase implements IUseCase<TaskUnitEntity[], NoParams> {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(_params: NoParams): Promise<TaskUnitEntity[]> {
    return this.referenceRepository.findPredefinedUnits();
  }
}
