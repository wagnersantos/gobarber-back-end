import FakeAppointmentsRepository from '../../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '../ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('listProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month avaliability provider', async () => {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    // eslint-disable-next-line no-plusplus
    for (let i = 8; i < 18; i++) {
      // eslint-disable-next-line no-await-in-loop
      await fakeAppointmentsRepository.create({
        providerId: 'user',
        userId: 'userId',
        date: new Date(year, month, day, i, 0, 0),
      });
    }

    const avaliability = await listProviderMonthAvailabilityService.execute({
      providerId: 'user',
      year: 2020,
      month,
    });

    expect(avaliability).toEqual(
      expect.arrayContaining([
        { day: day - 1, available: false },
        { day, available: true },
      ]),
    );
  });
});
