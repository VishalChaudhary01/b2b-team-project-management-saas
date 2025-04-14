import passport from 'passport';
import { Request } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.config';
import { NotFoundException } from '@utils/appError';
import { AccountProviderEnum } from '@enums/account-provider.enum';
import { loginOrCreateAccountService } from '@services/auth.service';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (_req: Request, _accessToken, _refreshToken, profile, cb) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        if (!googleId) {
          throw new NotFoundException('Google Id is missing');
        }
        const { user } = await loginOrCreateAccountService({
          provider: AccountProviderEnum.GOOGLE,
          name: profile.displayName,
          providerId: googleId,
          profilePicture: picture,
          email: email,
        });
        cb(null, user);
      } catch (error) {
        cb(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, cb) => cb(null, user));
passport.deserializeUser((user: any, cb) => cb(null, user));
