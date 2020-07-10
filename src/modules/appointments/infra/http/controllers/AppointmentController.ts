import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentsService from 'modules/appointments/services/CreateAppointmentsService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { providerId, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentsService);

    const appointment = await createAppointment.execute({
      providerId,
      userId,
      date,
    });

    return response.json(appointment);
  }
}
