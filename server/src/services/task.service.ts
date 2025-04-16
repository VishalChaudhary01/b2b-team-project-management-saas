import { Task } from '@models/Task';
import { Member } from '@models/Member';
import { Project } from '@models/Project';
import { TaskPriorityEnum, TaskStatusEnum } from '@enums/task.enum';
import { BadRequestException, NotFoundException } from '@utils/appError';

interface CreateTaskInputs {
  title: string;
  description?: string;
  priority: string;
  status: string;
  assignedTo?: string | null;
  dueDate?: string;
}

interface UpdateTaskInputs {
  title: string;
  description?: string;
  priority: string;
  status: string;
  assignedTo?: string | null;
  dueDate?: string;
}

export const createTaskService = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  inputs: CreateTaskInputs
) => {
  const { title, description, priority, status, assignedTo, dueDate } = inputs;

  const project = await Project.findById(projectId);
  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      'Project not found or does not belong to this workspace'
    );
  }

  if (assignedTo) {
    const isAssignedUserMember = await Member.exists({
      userId: assignedTo,
      workspaceId,
    });
    if (!isAssignedUserMember) {
      throw new Error('Assigned user is not a member of this workspace.');
    }
  }

  const task = new Task({
    title,
    description,
    priority: priority || TaskPriorityEnum.MEDIUM,
    status: status || TaskStatusEnum.TODO,
    assignedTo,
    createdBy: userId,
    workspace: workspaceId,
    project: projectId,
    dueDate,
  });

  await task.save();

  return { task };
};

export const updateTaskService = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  inputs: UpdateTaskInputs
) => {
  const project = await Project.findById(projectId);
  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      'Project not found or does not belong to this workspace'
    );
  }

  const task = await Task.findById(taskId);
  if (!task || task.project.toString() !== projectId.toString()) {
    throw new NotFoundException(
      'Task not found or does not belong to this project'
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { ...inputs },
    { new: true }
  );
  if (!updatedTask) {
    throw new BadRequestException('Failed to update task');
  }

  return { updatedTask };
};

export const getAllTasksService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const query: Record<string, any> = {
    workspace: workspaceId,
  };

  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.status && filters.status?.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.priority && filters.priority?.length > 0) {
    query.priority = { $in: filters.priority };
  }

  if (filters.assignedTo && filters.assignedTo?.length > 0) {
    query.assignedTo = { $in: filters.assignedTo };
  }

  if (filters.keyword && filters.keyword !== undefined) {
    query.title = { $regex: filters.keyword, $options: 'i' };
  }

  if (filters.dueDate) {
    query.dueDate = {
      $eq: new Date(filters.dueDate),
    };
  }

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [tasks, totalCount] = await Promise.all([
    Task.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate('assignedTo', '_id name profilePicture -password')
      .populate('project', '_id emoji name'),
    Task.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const project = await Project.findById(projectId);
  if (!project || project.workspace.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      'Project not found or does not belong to this workspace'
    );
  }

  const task = await Task.findOne({
    _id: taskId,
    workspace: workspaceId,
    project: projectId,
  }).populate('assignedTo', '_id name profilePicture -password');
  if (!task) {
    throw new NotFoundException('Task not found.');
  }

  return task;
};

export const deleteTaskService = async (
  workspaceId: string,
  taskId: string
) => {
  const task = await Task.findOneAndDelete({
    _id: taskId,
    workspace: workspaceId,
  });
  if (!task) {
    throw new NotFoundException(
      'Task not found or does not belong to the specified workspace'
    );
  }

  return;
};
