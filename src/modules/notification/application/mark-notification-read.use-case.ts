import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface MarkNotificationReadParams {
  notificationId: string;
  receiverId: string;
}

@Injectable()
export class MarkNotificationReadUseCase
  implements IUseCase<void, MarkNotificationReadParams>
{
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(params: MarkNotificationReadParams): Promise<void> {
    await this.notificationRepository.markRead(params.notificationId, params.receiverId);
  }
}
