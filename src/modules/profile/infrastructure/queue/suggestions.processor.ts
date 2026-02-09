import { Inject, Injectable } from '@nestjs/common';
import type { Job } from 'bullmq';
import { IFollowLocalDataSource } from '../data-sources/follow.local.datasource.interface';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';
import { SuggestionsComputeService } from '../../application/suggestions-compute.service';

const GLOBAL_TOP = 100;
const GRAPH_BATCH = 500;
const GRAPH_TOP = 10;

@Injectable()
export class SuggestionsProcessor {
  constructor(
    @Inject(IFollowLocalDataSource)
    private readonly followLocal: IFollowLocalDataSource,
    @Inject(IProfileRepository)
    private readonly profileRepo: IProfileRepository,
    private readonly suggestionsCompute: SuggestionsComputeService,
  ) {}

  async handle(job: Job): Promise<void> {
    if (job.name === 'global') {
      await this.runGlobalSuggestions();
    } else if (job.name === 'graph-proximity') {
      await this.runGraphProximity();
    }
  }

  private async runGlobalSuggestions(): Promise<void> {
    const userIds = await this.profileRepo.getTopUserIdsByFollowerCount(GLOBAL_TOP);
    await this.followLocal.setGlobalSuggestions(userIds);
  }

  private async runGraphProximity(): Promise<void> {
    const userIds = await this.profileRepo.getBatchUserIds(GRAPH_BATCH);
    for (const userId of userIds) {
      try {
        const suggestions = await this.suggestionsCompute.computeGraphProximitySuggestions(
          userId,
          GRAPH_TOP,
        );
        if (suggestions.length > 0) {
          await this.followLocal.setSuggestions(userId, suggestions);
        }
      } catch {
        // skip single user on error
      }
    }
  }
}
