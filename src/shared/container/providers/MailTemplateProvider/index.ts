import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplateProvider';
import HandleBarsMailTemplateProvider from './implementations/HandleBarsMailTemplateProvider';

const providers = {
  handleBars: HandleBarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handleBars,
);
