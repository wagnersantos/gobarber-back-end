import AppError from 'shared/errors/AppError';

import FakeNotificationRepository from 'modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeRedisCacheProvider from 'shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentsService from '../CreateAppointmentsService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointmentsService: CreateAppointmentsService;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeRedisCacheProvider: FakeRedisCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeRedisCacheProvider = new FakeRedisCacheProvider();

    createAppointmentsService = new CreateAppointmentsService(
      fakeAppointmentRepository,
      fakeNotificationRepository,
      fakeRedisCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentsService.execute({
      date: new Date(2020, 4, 10, 13),
      userId: '123',
      providerId: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerId).toBe('123123123');
  });

  it('should not be able to create two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 9, 13).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 13);

    await createAppointmentsService.execute({
      date: appointmentDate,
      userId: '123',
      providerId: '123123123',
    });

    await expect(
      createAppointmentsService.execute({
        date: appointmentDate,
        userId: '123',
        providerId: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11);

    await expect(
      createAppointmentsService.execute({
        date: appointmentDate,
        userId: '123',
        providerId: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment same user', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 13);

    await expect(
      createAppointmentsService.execute({
        date: appointmentDate,
        userId: '123',
        providerId: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment outside hour', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const beforeDate = new Date(2020, 4, 11, 7);
    const afterDate = new Date(2020, 4, 11, 18);

    await expect(
      createAppointmentsService.execute({
        date: beforeDate,
        userId: '123',
        providerId: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentsService.execute({
        date: afterDate,
        userId: '123',
        providerId: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
