import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { IFollowLocalDataSource } from '../infrastructure/data-sources/follow.local.datasource.interface';
import { HabitProfileEntity } from '../domain/entities/profile.entity';
import { SuggestionsComputeService } from './suggestions-compute.service';

const TOP_N = 20;

/**
 * Level 1: Read user:{id}:suggestions; on miss compute mutual friends, cache, return.
 * Level 2: If following empty or no suggestions, use global:suggestions.
 */
@Injectable()
export class GetSuggestedUsersUseCase {
  constructor(
    @Inject(IFollowLocalDataSource)
    private readonly followLocal: IFollowLocalDataSource,
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
    private readonly suggestionsCompute: SuggestionsComputeService,
  ) {}

  async execute(userId: string): Promise<HabitProfileEntity[]> {
    const cached = await this.followLocal.getSuggestions(userId);
    if (cached != null && cached.length > 0) {
      const profiles = await this.profileRepository.findManyByUserIds(cached);
      return this.orderByCached(cached, profiles);
    }

    const myFollowing = await this.followLocal.getFollowingIds(userId);
    if (myFollowing.length > 0) {
      const computed = await this.suggestionsCompute.computeMutualFriendSuggestions(userId, TOP_N);
      if (computed.length > 0) {
        await this.followLocal.setSuggestions(userId, computed);
        const profiles = await this.profileRepository.findManyByUserIds(computed);
        return this.orderByCached(computed, profiles);
      }
    }

    const global = await this.followLocal.getGlobalSuggestions();
    if (global != null && global.length > 0) {
      const profiles = await this.profileRepository.findManyByUserIds(global);
      return this.orderByCached(global, profiles);
    }

    return [];
  }

  private orderByCached(ids: string[], profiles: HabitProfileEntity[]): HabitProfileEntity[] {
    const byId = new Map(profiles.map((p) => [p.userId, p]));
    const result: HabitProfileEntity[] = [];
    for (const id of ids) {
      const p = byId.get(id);
      if (p) result.push(p);
    }
    return result;
  }
}
