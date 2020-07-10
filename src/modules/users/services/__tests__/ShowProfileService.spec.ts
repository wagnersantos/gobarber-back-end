import AppError from 'shared/errors/AppError';

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import ShowProfileService from '../ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const profile = await showProfileService.execute({
      userId: user.id,
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should not  be able to show the profile from non-existing user', async () => {
    await expect(
      showProfileService.execute({
        userId: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
