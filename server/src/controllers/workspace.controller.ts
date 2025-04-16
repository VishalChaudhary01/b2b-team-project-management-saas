import { Request, Response } from 'express';
import { HTTPSTATUS } from '@config/http.config';
import { roleGuard } from '@utils/role-gard';
import { Permissions } from '@enums/role.enum';
import { asyncHandler } from '@middlewares/asyncHandler';
import { getMemberRoleInWorkspaceService } from '@services/member.service';
import {
  changeMemberRoleService,
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceAnalyticsService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
  updateWorkspaceByIdService,
} from '@services/workspace.service';
import {
  changeRoleSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
} from '@validators/workspace.validator';

export const createWorkspace = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = createWorkspaceSchema.parse(req.body);

    const { workspace } = await createWorkspaceService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Workspace created successfully',
      workspace,
    });
  }
);

export const getAllWorkspacesUserIsMember = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'User workspaces fetched successfully',
      workspaces,
    });
  }
);

export const getWorkspaceById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    await getMemberRoleInWorkspaceService(userId, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Workspace fetched successfully',
      workspace,
    });
  }
);

export const getWorkspaceMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Workspace members retrieved successfully',
      members,
      roles,
    });
  }
);

export const getWorkspaceAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
      message: 'Workspace analytics retrieved successfully',
      analytics,
    });
  }
);

export const changeWorkspaceMemberRole = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(
      workspaceId,
      memberId,
      roleId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: 'Member Role changed successfully',
      member,
    });
  }
);

export const updateWorkspaceById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdService(workspaceId, {
      name,
      description,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: 'Workspace updated successfully',
      workspace,
    });
  }
);

export const deleteWorkspaceById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(
      workspaceId,
      userId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: 'Workspace deleted successfully',
      currentWorkspace,
    });
  }
);
