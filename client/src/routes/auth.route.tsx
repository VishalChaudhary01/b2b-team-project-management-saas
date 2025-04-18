import useAuth from '@/hooks/api/use-auth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthRoute } from './common/routePath';
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';

export const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;
  const _isAuthRoute = isAuthRoute(location.pathname);
  console.log('Auth route::', authData);

  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />;

  if (!user) return <Outlet />;

  return <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />;
};
