import 'dotenv/config';
import express, { Request, Response } from 'express';
import { config } from './config/env.config';

const app = express();

app.get(`${config.BASE_PATH}`, (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Healthy server',
  });
});

app.listen(config.PORT, () =>
  console.log(
    `🚀 Server running at http://localhost:${config.PORT}${config.BASE_PATH} (env: ${config.NODE_ENV})`
  )
);
