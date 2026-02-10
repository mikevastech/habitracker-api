import { Injectable, Inject } from '@nestjs/common';
import {
  IReferenceRepository,
  CreateCategoryData,
} from '../domain/repositories/reference.repository.interface';
import { CategoryEntity } from '../domain/entities/reference.entity';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(userId: string, data: CreateCategoryData): Promise<CategoryEntity> {
    return this.referenceRepository.createCategory(userId, data);
  }
}
