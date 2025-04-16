import { Request, Response } from 'express';
import { HTTPSTATUS } from '@config/http.config';
import { roleGuard } from '@utils/role-gard';
import { Permissions } from '@enums/role.enum';
import { asyncHandler } from '@middlewares/asyncHandler';
import { projectIdSchema } from '@validators/project.validator';
import { workspaceIdSchema } from '@validators/workspace.validator';
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from '@validators/task.validator';
import { getMemberRoleInWorkspaceService } from '@services/member.service';
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from '@services/task.service';

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const body = createTaskSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_TASK]);

  const { task } = await createTaskService(
    workspaceId,
    projectId,
    userId,
    body
  );

  return res.status(HTTPSTATUS.OK).json({
    message: 'Task created successfully',
    task,
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const body = updateTaskSchema.parse(req.body);
  const taskId = taskIdSchema.parse(req.params.id);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_TASK]);

  const { updatedTask } = await updateTaskService(
    workspaceId,
    projectId,
    taskId,
    body
  );

  return res.status(HTTPSTATUS.OK).json({
    message: 'Task updated successfully',
    task: updatedTask,
  });
});

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const filters = {
    projectId: req.query.projectId as string | undefined,
    status: req.query.status
      ? (req.query.status as string)?.split(',')
      : undefined,
    priority: req.query.priority
      ? (req.query.priority as string)?.split(',')
      : undefined,
    assignedTo: req.query.assignedTo
      ? (req.query.assignedTo as string)?.split(',')
      : undefined,
    keyword: req.query.keyword as string | undefined,
    dueDate: req.query.dueDate as string | undefined,
  };

  const pagination = {
    pageSize: parseInt(req.query.pageSize as string) || 10,
    pageNumber: parseInt(req.query.pageNumber as string) || 1,
  };

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const result = await getAllTasksService(workspaceId, filters, pagination);

  return res.status(HTTPSTATUS.OK).json({
    message: 'All tasks fetched successfully',
    ...result,
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const taskId = taskIdSchema.parse(req.params.id);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const task = await getTaskByIdService(workspaceId, projectId, taskId);

  return res.status(HTTPSTATUS.OK).json({
    message: 'Task fetched successfully',
    task,
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const taskId = taskIdSchema.parse(req.params.id);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

  const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_TASK]);

  await deleteTaskService(workspaceId, taskId);

  return res.status(HTTPSTATUS.OK).json({
    message: 'Task deleted successfully',
  });
});
