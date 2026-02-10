import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../domain/entities/notification.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { Paginated } from '../../../shared/domain/paginated.types';

export interface ListNotificationsParams {
  receiverId: string;
  limit: number;
  cursor?: string;
  unreadOnly?: boolean;
}

@Injectable()
export class ListNotificationsUseCase
  implements IUseCase<Paginated<NotificationEntity>, ListNotificationsParams>
{
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(params: ListNotificationsParams): Promise<Paginated<NotificationEntity>> {
    return this.notificationRepository.listByUserId(
      params.receiverId,
      params.limit,
      params.cursor,
      { unreadOnly: params.unreadOnly },
    );
  }
}
