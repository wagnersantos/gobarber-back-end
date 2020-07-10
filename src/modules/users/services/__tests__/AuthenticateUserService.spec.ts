import AppError from 'shared/errors/AppError';

import FakeRedisCacheProvider from 'shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from '../AuthenticateUserService';
import CreateUsersService from '../CreateUsersService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUsersService;
let authenticateUser: AuthenticateUserService;
let fakeRedisCacheProvider: FakeRedisCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeRedisCacheProvider = new FakeRedisCacheProvider();

    createUser = new CreateUsersService(
      fakeUserRepository,
      fakeHashProvider,
      fakeRedisCacheProvider,
    );

    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.comm',
      password: '123123123',
    });

    const response = await authenticateUser.execute({
      email: 'johndoe@example.comm',
      password: '123123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.comm',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.comm',
      password: '123123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.comm',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
