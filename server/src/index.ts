import 'dotenv/config';
import 'module-alias/register';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { config } from '@config/env.config';
import { connectDatabase } from '@config/db.config';
import { errorHandler } from '@middlewares/errorHandler';
import { isAuthenticated } from '@middlewares/isAuthenticated';

import '@config/passport.config';
import passport from 'passport';
import authRoutes from '@routes/auth.route';
import memberRoutes from '@routes/member.route';
import projectRoutes from '@routes/project.route';
import taskRoutes from '@routes/task.route';
import userRoutes from '@routes/user.route';
import workspaceRoutes from '@routes/workspace.route';
import { redisClient } from '@utils/redis-client';
import { seedRoles } from './seeds/role.seed';

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(config.SESSION_EXPIRES_IN) * 1000,
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
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

app.get(`/`, (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Healthy server',
  });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `🚀 Server running at http://localhost:${config.PORT}${config.BASE_PATH} (env: ${config.NODE_ENV})`
  );
  try {
    await connectDatabase();
    await seedRoles();
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
});
