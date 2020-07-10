import AppError from 'shared/errors/AppError';
import FakeStorageProvider from 'shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdatedUserAvatarService from '../UpdatedUserAvatarService';

let fakeUserRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updatedUserAvatar: UpdatedUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updatedUserAvatar = new UpdatedUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.comm',
      password: '123123123',
    });

    await updatedUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar with from non existing user', async () => {
    await expect(
      updatedUserAvatar.execute({
        userId: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delte old avatar when update new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.comm',
      password: '123123123',
    });

    await updatedUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updatedUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
