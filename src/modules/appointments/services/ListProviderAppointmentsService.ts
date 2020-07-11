import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from 'shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('RedisCacheProvider')
    private redisCacheProvider: ICacheProvider,
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequestDTO): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;
    let appointments =
      (await this.redisCacheProvider.recover<Appointment[]>(cacheKey)) || [];

    switch (appointments.length) {
      case 0:
        appointments = await this.appointmentsRepository.findAllInDayFromProvider(
          {
            providerId,
            day,
            month,
            year,
          },
        );

        await this.redisCacheProvider.save(
          cacheKey,
          classToClass(appointments),
        );

        break;
      default:
    }

    return appointments;
  }
}
