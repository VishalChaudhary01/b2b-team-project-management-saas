import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';
import useAuth from '@/hooks/api/use-auth';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuth();
  console.log('Protected Route:: ', authData);
  const user = authData?.user;

  if (isLoading) return <DashboardSkeleton />;

  return user ? <Outlet /> : <Navigate to='/' replace />;
};
