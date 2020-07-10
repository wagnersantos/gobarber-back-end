import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from 'config/upload';
import routes from './routes';
import errorMiddleware from './middlewares/errorMiddleware';
import rateLimiter from './middlewares/rateLimiterMiddleware';

import 'shared/infra/typeorm';
import 'shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(errorMiddleware);

app.listen(3333, () => {
  console.log('🐳 server listening 🔥 http://localhost:3333 🔥 🐳');
});
