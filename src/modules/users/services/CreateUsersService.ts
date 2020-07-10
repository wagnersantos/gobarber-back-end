import { inject, injectable } from 'tsyringe';

import AppError from 'shared/errors/AppError';

import ICacheProvider from 'shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from 'modules/users/repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('RedisCacheProvider')
    private redisCacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email adress already used!');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.redisCacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUsersService;
