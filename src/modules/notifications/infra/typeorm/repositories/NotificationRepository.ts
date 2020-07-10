import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationRepository from 'modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from 'modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

export default class NotificationRepository implements INotificationRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    recipientId,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({ recipientId, content });

    await this.ormRepository.save(notification);

    return notification;
  }
}
