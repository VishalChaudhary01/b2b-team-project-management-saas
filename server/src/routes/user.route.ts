import { Router } from 'express';
import { getCurrentUser } from '@controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/current', getCurrentUser);

export default userRoutes;
