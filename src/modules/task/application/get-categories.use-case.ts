import { Injectable, Inject } from '@nestjs/common';
import { IReferenceRepository } from '../domain/repositories/reference.repository.interface';
import { CategoryEntity } from '../domain/entities/reference.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetCategoriesParams {
  userId: string;
}

@Injectable()
export class GetCategoriesUseCase implements IUseCase<CategoryEntity[], GetCategoriesParams> {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(params: GetCategoriesParams): Promise<CategoryEntity[]> {
    return this.referenceRepository.findCategoriesForUser(params.userId);
  }
}
