import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from '@controllers/task.controller';

const taskRoutes = Router();

taskRoutes.post(
  '/project/:projectId/workspace/:workspaceId/create',
  createTask
);
taskRoutes.delete('/:id/workspace/:workspaceId/delete', deleteTask);
taskRoutes.put(
  '/:id/project/:projectId/workspace/:workspaceId/update',
  updateTask
);
taskRoutes.get('/workspace/:workspaceId/all', getAllTasks);
taskRoutes.get('/:id/project/:projectId/workspace/:workspaceId', getTaskById);

export default taskRoutes;
