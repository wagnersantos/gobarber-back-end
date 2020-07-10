import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from 'modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from 'modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from 'modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from 'modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(
    date: Date,
    providerId: string,
  ): Promise<Appointment | undefined> {
    const findAppoitment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.providerId === providerId,
    );

    return findAppoitment;
  }

  public async findAllInMonthFromProvider({
    providerId,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appoitments = this.appointments.filter(
      appointment =>
        appointment.providerId === providerId &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appoitments;
  }

  public async findAllInDayFromProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appoitments = this.appointments.filter(
      appointment =>
        appointment.providerId === providerId &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appoitments;
  }

  public async create({
    providerId,
    userId,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      userId,
      date,
      providerId,
    });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
