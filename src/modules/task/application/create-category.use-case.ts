import { Injectable, Inject } from '@nestjs/common';
import {
  IReferenceRepository,
  CreateCategoryData,
} from '../domain/repositories/reference.repository.interface';
import { CategoryEntity } from '../domain/entities/reference.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface CreateCategoryParams {
  userId: string;
  data: CreateCategoryData;
}

@Injectable()
export class CreateCategoryUseCase implements IUseCase<CategoryEntity, CreateCategoryParams> {
  constructor(
    @Inject(IReferenceRepository)
    private readonly referenceRepository: IReferenceRepository,
  ) {}

  async execute(params: CreateCategoryParams): Promise<CategoryEntity> {
    return this.referenceRepository.createCategory(params.userId, params.data);
  }
}
