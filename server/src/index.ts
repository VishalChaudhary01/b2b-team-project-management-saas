import 'dotenv/config';
import 'module-alias/register';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'cookie-session';
import { config } from '@config/env.config';
import { errorHandler } from '@middlewares/errorHandler';
import { connectDatabase } from '@config/db.config';

import '@config/passport.config';
import passport from 'passport';
import authRoutes from '@routes/auth.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: 'session',
    keys: [config.SESSION_SECRET],
    maxAge: parseInt(config.SESSION_EXPIRES_IN),
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(`${config.BASE_PATH}`, (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Healthy server',
  });
});

app.use(`${config.BASE_PATH}/auth`, authRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `🚀 Server running at http://localhost:${config.PORT}${config.BASE_PATH} (env: ${config.NODE_ENV})`
  );
  await connectDatabase();
});
