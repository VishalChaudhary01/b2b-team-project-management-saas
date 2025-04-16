import { Request, Response } from 'express';
import { HTTPSTATUS } from '@config/http.config';
import { asyncHandler } from '@middlewares/asyncHandler';
import { inviteCodeSchema } from '@validators/member.validator';
import { joinWorkspaceByInviteService } from '@services/member.service';

export const joinWorkSpace = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const inviteCode = inviteCodeSchema.parse(req.params.inviteCode);

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
    );

    return res.status(HTTPSTATUS.OK).json({
      message: 'Successfully joined the workspace',
      workspaceId,
      role,
    });
  }
);
