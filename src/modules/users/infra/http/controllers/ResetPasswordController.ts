import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from 'modules/users/services/ResetPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { password, token } = request.body;

      const resetPasswordService = container.resolve(ResetPasswordService);

      await resetPasswordService.execute({
        password,
        token,
      });

      return response.status(204).json();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
