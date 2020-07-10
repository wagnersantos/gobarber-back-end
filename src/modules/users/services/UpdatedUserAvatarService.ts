import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import uploadConfig from 'config/upload';
import AppError from 'shared/errors/AppError';
import IUsersRepository from 'modules/users/repositories/IUsersRepository';
import IStorageProvider from 'shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  userId: string;
  avatarFilename: string;
}

@injectable()
class UpdatedUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ userId, avatarFilename }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Only auntenticate user can change avatar!');
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdatedUserAvatarService;
