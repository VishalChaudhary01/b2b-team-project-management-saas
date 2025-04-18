import { AuthProvider } from '@/context/auth-provider';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
