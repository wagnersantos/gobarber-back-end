import { inject, injectable } from 'tsyringe';

import AppError from 'shared/errors/AppError';
import IUsersRepository from 'modules/users/repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  userId: string;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}
