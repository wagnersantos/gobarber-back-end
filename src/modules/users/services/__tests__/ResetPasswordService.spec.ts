import AppError from 'shared/errors/AppError';

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from '../ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '12323',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('12323');
    expect(updatedUser?.password).toBe('12323');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({ token: 'non-existing-token', password: '1234' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPassword.execute({ token, password: '1234' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    await expect(
      resetPassword.execute({
        password: '12323',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
