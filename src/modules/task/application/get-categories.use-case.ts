import { Injectable, Inject } from '@nestjs/common';
import { IReferenceRepository } from '../domain/repositories/reference.repository.interface';
import { CategoryEntity } from '../domain/entities/reference.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import { NoParams } from '../../../shared/domain/ports/use-case.port';

@Injectable()
export class GetCategoriesUseCase implements IUseCase<CategoryEntity[], NoParams> {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(_params: NoParams): Promise<CategoryEntity[]> {
    return this.referenceRepository.findPredefinedCategories();
  }
}
