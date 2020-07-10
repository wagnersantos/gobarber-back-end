import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from 'shared/errors/AppError';

import IAppointmentsRepository from 'modules/appointments/repositories/IAppointmentsRepository';
import INotificationRepository from 'modules/notifications/repositories/INotificationRepository';
import ICacheProvider from 'shared/container/providers/CacheProvider/models/ICacheProvider';

import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequestDTO {
  providerId: string;
  userId: string;
  date: Date;
}

@injectable()
class CreateAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,

    @inject('RedisCacheProvider')
    private redisCacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    providerId,
    userId,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const isAppointmentDateBefore = isBefore(appointmentDate, Date.now());

    if (userId === providerId) {
      throw new AppError('You can not create an appointment with yourself');
    }

    const findAppointmentsInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      providerId,
    );

    if (findAppointmentsInSameDate) {
      throw new AppError('This appointment is already block!');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointments btween 8am to 5pm');
    }

    if (isAppointmentDateBefore) {
      throw new AppError('You can not create an appointment on past');
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      userId,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationRepository.create({
      recipientId: providerId,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    const cacheKey = `provider-appointments:${providerId}:${format(
      appointmentDate,
      'yyyy-M-d',
    )}`;

    await this.redisCacheProvider.invalidate(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentsService;
