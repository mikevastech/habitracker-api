import { Injectable, Inject } from '@nestjs/common';
import { IReferenceRepository } from '../domain/repositories/reference.repository.interface';
import { TaskUnitEntity } from '../domain/entities/reference.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetUnitsParams {
  userId: string;
}

@Injectable()
export class GetUnitsUseCase implements IUseCase<TaskUnitEntity[], GetUnitsParams> {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(params: GetUnitsParams): Promise<TaskUnitEntity[]> {
    return this.referenceRepository.findUnitsForUser(params.userId);
  }
}
