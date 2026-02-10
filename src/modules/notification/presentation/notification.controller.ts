import { ApiTags, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { ListNotificationsUseCase } from '../application/list-notifications.use-case';
import { MarkNotificationReadUseCase } from '../application/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../application/mark-all-notifications-read.use-case';
import { PaginatedNotificationsResponseDto } from '../application/dtos/notification-response.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(SessionGuard)
export class NotificationController {
  constructor(
    private readonly listNotificationsUseCase: ListNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: PaginatedNotificationsResponseDto })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
    @Query('unreadOnly') unreadOnlyStr?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    const unreadOnly = unreadOnlyStr === 'true' || unreadOnlyStr === '1';
    return this.listNotificationsUseCase.execute({
      receiverId: user.id,
      limit,
      cursor,
      unreadOnly: unreadOnly || undefined,
    });
  }

  @Patch(':id/read')
  @ApiNoContentResponse()
  async markRead(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.markNotificationReadUseCase.execute({
      notificationId: id,
      receiverId: user.id,
    });
  }

  @Patch('read-all')
  @ApiNoContentResponse()
  async markAllRead(@CurrentUser() user: AuthenticatedUser) {
    await this.markAllNotificationsReadUseCase.execute({ receiverId: user.id });
  }
}
