import { Router } from 'express';
import passport from 'passport';
import { config } from '@config/env.config';

const authRouter = Router();

const failureURL = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: failureURL,
  })
);

export default authRouter;
