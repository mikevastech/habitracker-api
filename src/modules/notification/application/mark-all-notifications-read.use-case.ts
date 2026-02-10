import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface MarkAllNotificationsReadParams {
  receiverId: string;
}

@Injectable()
export class MarkAllNotificationsReadUseCase
  implements IUseCase<void, MarkAllNotificationsReadParams>
{
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(params: MarkAllNotificationsReadParams): Promise<void> {
    await this.notificationRepository.markAllRead(params.receiverId);
  }
}
