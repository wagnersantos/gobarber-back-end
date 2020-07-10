import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUsersService from 'modules/users/services/CreateUsersService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;

      const createUser = container.resolve(CreateUsersService);

      const user = await createUser.execute({ name, email, password });

      return response.json(classToClass(user));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
