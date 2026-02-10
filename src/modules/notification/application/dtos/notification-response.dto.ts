import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  receiverId!: string;

  @ApiProperty()
  senderId!: string;

  @ApiProperty()
  notificationTypeId!: string;

  @ApiProperty()
  senderName!: string;

  @ApiPropertyOptional()
  senderAvatar!: string | null;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  data!: any;

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export class PaginatedNotificationsResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  items!: NotificationResponseDto[];

  @ApiPropertyOptional()
  nextCursor?: string;
}
