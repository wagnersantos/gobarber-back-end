import AppError from 'shared/errors/AppError';

import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '../UpdateProfileService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'John Yeah',
      email: 'johnyeah@example.com',
    });

    expect(updatedUser.name).toBe('John Yeah');
    expect(updatedUser.email).toBe('johnyeah@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const user = await fakeUserRepository.create({
      name: 'John Yeah',
      email: 'johnyeah@example.com',
      password: '123321',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    const updatedUser = await updateProfile.execute({
      userId: user.id,
      name: 'John Yeah',
      email: 'johnyeah@example.com',
      oldPassword: '123123123',
      password: '0988767',
    });

    expect(updatedUser.password).toBe('0988767');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'John Yeah',
        email: 'johnyeah@example.com',
        password: '0988767',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123123',
    });

    await expect(
      updateProfile.execute({
        userId: user.id,
        name: 'John Yeah',
        email: 'johnyeah@example.com',
        oldPassword: 'wrong-old-password',
        password: '0988767',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not  be able to show the update from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        userId: 'non-existing-user-id',
        name: 'John Yeah',
        email: 'johnyeah@example.com',
        oldPassword: 'wrong-old-password',
        password: '0988767',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
