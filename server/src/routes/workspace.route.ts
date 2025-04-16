import { Router } from 'express';
import {
  changeWorkspaceMemberRole,
  createWorkspace,
  deleteWorkspaceById,
  getAllWorkspacesUserIsMember,
  getWorkspaceAnalytics,
  getWorkspaceById,
  getWorkspaceMembers,
  updateWorkspaceById,
} from '../controllers/workspace.controller';

const workspaceRoutes = Router();

workspaceRoutes.post('/create/new', createWorkspace);
workspaceRoutes.put('/update/:id', updateWorkspaceById);
workspaceRoutes.put('/change/member/role/:id', changeWorkspaceMemberRole);
workspaceRoutes.delete('/delete/:id', deleteWorkspaceById);
workspaceRoutes.get('/all', getAllWorkspacesUserIsMember);
workspaceRoutes.get('/members/:id', getWorkspaceMembers);
workspaceRoutes.get('/analytics/:id', getWorkspaceAnalytics);
workspaceRoutes.get('/:id', getWorkspaceById);

export default workspaceRoutes;
