import AppError from 'shared/errors/AppError';

import FakeRedisCacheProvider from 'shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';

import CreateUsersService from '../CreateUsersService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUsersService;
let fakeRedisCacheProvider: FakeRedisCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeRedisCacheProvider = new FakeRedisCacheProvider();

    createUsersService = new CreateUsersService(
      fakeUserRepository,
      fakeHashProvider,
      fakeRedisCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUsersService.execute({
      name: 'John Doe',
      email: 'johndoe@example.comm',
      password: '123123123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUsersService.execute({
      name: 'John Doe',
      email: 'johndoe@example.comm',
      password: '123123123',
    });

    await expect(
      createUsersService.execute({
        name: 'John Doe',
        email: 'johndoe@example.comm',
        password: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
