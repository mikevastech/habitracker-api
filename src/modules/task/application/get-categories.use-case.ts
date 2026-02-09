import { Injectable, Inject } from '@nestjs/common';
import { IReferenceRepository } from '../domain/repositories/reference.repository.interface';
import { CategoryEntity } from '../domain/entities/reference.entity';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(): Promise<CategoryEntity[]> {
    return this.referenceRepository.findPredefinedCategories();
  }
}
