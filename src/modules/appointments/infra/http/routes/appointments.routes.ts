import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAunteticated from 'modules/users/infra/http/middlewares/ensureAunteticated';
import AppointmentController from '../controllers/AppointmentController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAunteticated);

appointmentsRouter.get('/me', providerAppointmentsController.index);
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      providerId: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentController.create,
);

export default appointmentsRouter;
