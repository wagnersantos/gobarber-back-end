import { ObjectID } from 'mongodb';

import INotificationRepository from 'modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from 'modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../../infra/typeorm/schemas/Notification';

export default class FakeNotificationRepository
  implements INotificationRepository {
  private notifications: Notification[] = [];

  public async create({
    recipientId,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), recipientId, content });

    this.notifications.push(notification);

    return notification;
  }
}
