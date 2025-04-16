import 'dotenv/config';
import 'module-alias/register';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'cookie-session';
import { config } from '@config/env.config';
import { connectDatabase } from '@config/db.config';
import { errorHandler } from '@middlewares/errorHandler';
import { isAuthenticated } from '@middlewares/isAuthenticated';

import '@config/passport.config';
import passport from 'passport';
import authRoutes from '@routes/auth.route';
import memberRoutes from '@routes/member.route';
import workspaceRoutes from '@routes/workspace.route';

const app = express();
const BASE_PATH = config.BASE_PATH;

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

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `🚀 Server running at http://localhost:${config.PORT}${config.BASE_PATH} (env: ${config.NODE_ENV})`
  );
  await connectDatabase();
});
