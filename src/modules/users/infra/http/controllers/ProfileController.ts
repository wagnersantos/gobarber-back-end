import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from 'modules/users/services/UpdateProfileService';
import ShowProfileService from 'modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user.id;

      const showProfileService = container.resolve(ShowProfileService);

      const user = await showProfileService.execute({
        userId,
      });

      return response.json(classToClass(user));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user.id;

      const { name, email, oldPassword, password } = request.body;

      const updateProfile = container.resolve(UpdateProfileService);

      const user = await updateProfile.execute({
        userId,
        name,
        email,
        oldPassword,
        password,
      });

      delete user.password;

      return response.json(classToClass(user));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}