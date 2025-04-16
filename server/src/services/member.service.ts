import { Role } from '@models/Role';
import { Member } from '@models/Member';
import { Workspace } from '@models/Workspace';
import { Roles } from '@enums/role.enum';
import { ErrorCodeEnum } from '@enums/error-code.enum';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@utils/appError';

export const getMemberRoleInWorkspaceService = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }

  const member = await Member.findOne({
    userId,
    workspaceId,
  }).populate('role');
  if (!member) {
    throw new UnauthorizedException(
      'You are not a member of this workspace',
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const roleName = member.role?.name;

  return { role: roleName };
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  const workspace = await Workspace.findOne({ inviteCode }).exec();
  if (!workspace) {
    throw new NotFoundException('Invalid invite code or workspace not found');
  }

  const existingMember = await Member.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();
  if (existingMember) {
    throw new BadRequestException('You are already a member of this workspace');
  }

  const role = await Role.findOne({ name: Roles.MEMBER });
  if (!role) {
    throw new NotFoundException('Role not found');
  }
  const newMember = new Member({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });
  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
};
