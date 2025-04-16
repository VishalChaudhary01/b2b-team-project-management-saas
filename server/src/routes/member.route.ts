import { Router } from 'express';
import { joinWorkSpace } from '@controllers/member.controller';

const memberRoutes = Router();

memberRoutes.post('/workspace/:inviteCode/join', joinWorkSpace);

export default memberRoutes;
