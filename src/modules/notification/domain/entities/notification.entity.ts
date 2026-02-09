export class NotificationEntity {
  id!: string;
  receiverId!: string;
  senderId!: string;
  notificationTypeId!: string;
  senderName!: string;
  senderAvatar!: string | null;
  title!: string;
  body!: string;
  data!: any;
  isRead!: boolean;
  createdAt!: Date;

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}

export class NotificationTypeRefEntity {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;

  constructor(partial: Partial<NotificationTypeRefEntity>) {
    Object.assign(this, partial);
  }
}
