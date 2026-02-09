import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../domain/entities/notification.entity';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    receiverId: string,
    limit: number,
    cursor?: string,
    options?: { unreadOnly?: boolean },
  ): Promise<{ items: NotificationEntity[]; nextCursor?: string }> {
    return this.notificationRepository.listByUserId(receiverId, limit, cursor, options);
  }
}
