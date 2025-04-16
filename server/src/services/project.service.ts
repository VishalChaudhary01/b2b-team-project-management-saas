import mongoose from 'mongoose';
import { Task } from '@models/Task';
import { Project } from '@models/Project';
import { TaskStatusEnum } from '@enums/task.enum';
import { NotFoundException } from '@utils/appError';

interface CreateProjectInputs {
  emoji?: string;
  name: string;
  description?: string;
}

interface UpdateProjectInputs {
  emoji?: string;
  name: string;
  description?: string;
}

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  inputs: CreateProjectInputs
) => {
  const { emoji, name, description } = inputs;

  const project = new Project({
    ...(emoji && { emoji: emoji }),
    name,
    description,
    workspace: workspaceId,
    createdBy: userId,
  });
  await project.save();

  return { project };
};

export const getProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  const totalCount = await Project.countDocuments({
    workspace: workspaceId,
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await Project.find({
    workspace: workspaceId,
  })
    .skip(skip)
    .limit(pageSize)
    .populate('createdBy', '_id name profilePicture -password')
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);

  return { projects, totalCount, totalPages, skip };
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  }).select('_id emoji name description');

  if (!project) {
    throw new NotFoundException(
      'Project not found or does not belong to the specified workspace'
    );
  }

  return { project };
};

export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await Project.findById(projectId);

  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      'Project not found or does not belong to this workspace'
    );
  }

  const currentDate = new Date();

  const taskAnalytics = await Task.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: 'count' }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: {
                $ne: TaskStatusEnum.DONE,
              },
            },
          },
          {
            $count: 'count',
          },
        ],
        completedTasks: [
          {
            $match: {
              status: TaskStatusEnum.DONE,
            },
          },
          { $count: 'count' },
        ],
      },
    },
  ]);

  const _analytics = taskAnalytics[0];

  const analytics = {
    totalTasks: _analytics.totalTasks[0]?.count || 0,
    overdueTasks: _analytics.overdueTasks[0]?.count || 0,
    completedTasks: _analytics.completedTasks[0]?.count || 0,
  };

  return {
    analytics,
  };
};

export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  inputs: UpdateProjectInputs
) => {
  const { name, emoji, description } = inputs;

  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  });
  if (!project) {
    throw new NotFoundException(
      'Project not found or does not belong to the specified workspace'
    );
  }

  if (emoji) project.emoji = emoji;
  if (name) project.name = name;
  if (description) project.description = description;
  await project.save();

  return { project };
};

export const deleteProjectService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await Project.findOne({
    _id: projectId,
    workspace: workspaceId,
  });
  if (!project) {
    throw new NotFoundException(
      'Project not found or does not belong to the specified workspace'
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await project.deleteOne().session(session);

    await Task.deleteMany({
      project: project._id,
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
