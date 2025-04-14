import 'dotenv/config';
import express, { Request, Response } from 'express';
import { config } from '@config/env.config';
import { errorHandler } from '@middlewares/errorHandler';
import { connectDatabase } from '@config/db.config';

const app = express();

app.get(`${config.BASE_PATH}`, (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Healthy server',
  });
});

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `🚀 Server running at http://localhost:${config.PORT}${config.BASE_PATH} (env: ${config.NODE_ENV})`
  );
  await connectDatabase();
});
