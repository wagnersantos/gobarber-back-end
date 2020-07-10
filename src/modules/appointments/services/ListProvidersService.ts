import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from 'modules/users/repositories/IUsersRepository';
import ICacheProvider from 'shared/container/providers/CacheProvider/models/ICacheProvider';

import User from 'modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  userId: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RedisCacheProvider')
    private redisCacheProvider: ICacheProvider,
  ) {}

  public async execute({ userId }: IRequestDTO): Promise<User[]> {
    const cacheKey = `providers-list:${userId}`;
    let users = await this.redisCacheProvider.recover<User[]>(cacheKey);

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        exceptUserId: userId,
      });

      await this.redisCacheProvider.save(cacheKey, classToClass(users));
    }

    return users;
  }
}
