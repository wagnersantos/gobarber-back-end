import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdatedUserAvatarService from 'modules/users/services/UpdatedUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const updatedUserAvatar = container.resolve(UpdatedUserAvatarService);

      const user = await updatedUserAvatar.execute({
        userId: request.user.id,
        avatarFilename: request.file.filename,
      });

      return response.json(classToClass(user));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
