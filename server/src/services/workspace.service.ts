import mongoose from 'mongoose';
import { User } from '@models/User';
import { Role } from '@models/Role';
import { Task } from '@models/Task';
import { Member } from '@models/Member';
import { Project } from '@models/Project';
import { Workspace } from '@models/Workspace';
import { Roles } from '@enums/role.enum';
import { TaskStatusEnum } from '@enums/task.enum';
import { BadRequestException, NotFoundException } from '@utils/appError';

interface CreateWorkspaceInputs {
  name: string;
  description?: string;
}

interface UpdateWorkspaceInputs {
  name: string;
  description?: string;
}

// CREATE NEW WORKSPACE
export const createWorkspaceService = async (
  userId: string,
  inputs: CreateWorkspaceInputs
) => {
  const { name, description } = inputs;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const ownerRole = await Role.findOne({ name: Roles.OWNER });
  if (!ownerRole) {
    throw new NotFoundException('Owner role not found');
  }

  const workspace = new Workspace({
    name: name,
    description: description,
    owner: user._id,
  });
  await workspace.save();

  const member = new Member({
    userId: user._id,
    workspaceId: workspace._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });
  await member.save();

  user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
  await user.save();

  return {
    workspace,
  };
};

// GET WORKSPACES WHERE USER IS A MEMBER
export const getAllWorkspacesUserIsMemberService = async (userId: string) => {
  const memberships = await Member.find({ userId })
    .populate('workspaceId')
    .exec();

  // Extract workspace details from memberships
  const workspaces = memberships.map((membership) => membership.workspaceId);

  return { workspaces };
};

// GET WORKSPACES BY ID
export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }

  const members = await Member.find({
    workspaceId,
  }).populate('role');

  const workspaceWithMembers = {
    ...workspace.toObject(),
    members,
  };

  return {
    workspace: workspaceWithMembers,
  };
};

// GET ALL MEMEBERS IN WORKSPACE
export const getWorkspaceMembersService = async (workspaceId: string) => {
  const members = await Member.find({ workspaceId })
    .populate('userId', 'name email profilePicture -password')
    .populate('role', 'name');

  const roles = await Role.find({}, { name: 1, _id: 1 })
    .select('-permission')
    .lean();

  return { members, roles };
};

// GET WORKSPACE ANALYTICS
export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
  const currentDate = new Date();

  const totalTasks = await Task.countDocuments({
    workspace: workspaceId,
  });

  const overdueTasks = await Task.countDocuments({
    workspace: workspaceId,
    dueDate: { $lt: currentDate },
    status: { $ne: TaskStatusEnum.DONE },
  });

  const completedTasks = await Task.countDocuments({
    workspace: workspaceId,
    status: TaskStatusEnum.DONE,
  });

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };

  return { analytics };
};

// CHANGE MEMBER ROLE
export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }

  const role = await Role.findById(roleId);
  if (!role) {
    throw new NotFoundException('Role not found');
  }

  const member = await Member.findOne({
    userId: memberId,
    workspaceId,
  });
  if (!member) {
    throw new Error('Member not found in the workspace');
  }

  member.role = role;
  await member.save();

  return { member };
};

// UPDATE WORKSPACE BY ID
export const updateWorkspaceByIdService = async (
  workspaceId: string,
  inputs: UpdateWorkspaceInputs
) => {
  const { name, description } = inputs;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException('Workspace not found');
  }

  if (name) workspace.name = name;
  if (description) workspace.description = description;
  await workspace.save();

  return {
    workspace,
  };
};

// DELETE WORKSPACE BY ID
export const deleteWorkspaceService = async (
  workspaceId: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const workspace = await Workspace.findById(workspaceId).session(session);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if the user owns the workspace
    if (workspace.owner.toString() !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this workspace'
      );
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await Project.deleteMany({ workspace: workspace._id }).session(session);
    await Task.deleteMany({ workspace: workspace._id }).session(session);

    await Member.deleteMany({
      workspaceId: workspace._id,
    }).session(session);

    // Update the user's currentWorkspace if it matches the deleted workspace
    if (user?.currentWorkspace?.equals(workspaceId)) {
      const memberWorkspace = await Member.findOne({ userId }).session(session);
      // Update the user's currentWorkspace
      user.currentWorkspace = memberWorkspace
        ? memberWorkspace.workspaceId
        : null;

      await user.save({ session });
    }

    await workspace.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      currentWorkspace: user.currentWorkspace,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
