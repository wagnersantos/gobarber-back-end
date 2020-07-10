import FakeUsersRepository from 'modules/users/repositories/fakes/FakeUsersRepository';
import FakeRedisCacheProvider from 'shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';

import ListProvidersService from '../ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeRedisCacheProvider: FakeRedisCacheProvider;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeRedisCacheProvider = new FakeRedisCacheProvider();

    listProvidersService = new ListProvidersService(
      fakeUserRepository,
      fakeRedisCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user1 = await fakeUserRepository.create({
      name: 'John Yeah',
      email: 'johnyeah@example.com',
      password: '654231',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'John One',
      email: 'johnone@example.com',
      password: '145632',
    });

    const providers = await listProvidersService.execute({
      userId: loggedUser.id,
    });

    expect(providers).toEqual([user, user1]);
  });
});
