import FakeRedisCacheProvider from 'shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';
import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '../ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeRedisCacheProvider: FakeRedisCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeRedisCacheProvider = new FakeRedisCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeRedisCacheProvider,
    );
  });

  it('should be able to list the appointment an specific day', async () => {
    const appointment = await fakeAppointmentsRepository.create({
      providerId: 'providerId',
      userId: 'userId',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      providerId: 'providerId',
      userId: 'userId',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      providerId: 'providerId',
      day: 20,
      year: 2020,
      month: 5,
    });

    expect(appointments).toEqual([appointment, appointment1]);
  });
});
