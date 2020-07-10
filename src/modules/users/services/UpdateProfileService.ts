import { inject, injectable } from 'tsyringe';

import AppError from 'shared/errors/AppError';
import IUsersRepository from 'modules/users/repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    password,
    oldPassword,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEMail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEMail && userWithUpdatedEMail.id !== userId) {
      throw new AppError('E-mail already in use.');
    }

    user.name = name;
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError('You need to inform the old password');
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}
