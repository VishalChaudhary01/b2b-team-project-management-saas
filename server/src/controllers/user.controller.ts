import { Request, Response } from 'express';
import { HTTPSTATUS } from '@config/http.config';
import { asyncHandler } from '@middlewares/asyncHandler';
import { getCurrentUserService } from '@services/user.service';

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'User fetch successfully',
      user,
    });
  }
);
