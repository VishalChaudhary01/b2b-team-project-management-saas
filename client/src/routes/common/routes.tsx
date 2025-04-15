import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from './routePath';
import { SignInPage } from '@/pages/auth/Signin.page';
import { SignUpPage } from '@/pages/auth/Signup.page';
import { GoogleOAuthFailurePage } from '@/pages/auth/GoogleOAuthFailure.page';
import { ProjectDetailsPage } from '@/pages/workspace/ProjectDetails.page';
import { WorkspaceDashboardPage } from '@/pages/workspace/Dashboard.page';
import { TasksPage } from '@/pages/workspace/Tasks.page';
import { MembersPage } from '@/pages/workspace/Members.page';
import { SettingsPage } from '@/pages/workspace/Settings.page';
import { InvitePage } from '@/pages/invite/Invite.page';

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignInPage /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUpPage /> },
  {
    path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK,
    element: <GoogleOAuthFailurePage />,
  },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboardPage /> },
  { path: PROTECTED_ROUTES.TASKS, element: <TasksPage /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <MembersPage /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <SettingsPage /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetailsPage /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InvitePage /> },
];
