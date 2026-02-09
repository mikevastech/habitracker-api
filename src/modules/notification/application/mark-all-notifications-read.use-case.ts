import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';

@Injectable()
export class MarkAllNotificationsReadUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(receiverId: string): Promise<void> {
    await this.notificationRepository.markAllRead(receiverId);
  }
}
