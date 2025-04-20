import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/auth-provider';
import { Header } from '@/components/common/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar/AppSidebar';
import { CreateWorkspaceDialog } from '@/components/workspace/CreateWorkspaceDialog';
import { CreateProjectDialog } from '@/components/workspace/project/CreateProjectDialog';

export const AppLayout = () => {
  return (
    <AuthProvider>
      <div className='flex h-screen w-full'>
        <SidebarProvider>
          <AppSidebar />
          <div className='w-full'>
            <Header />
            <main className='flex-1 overflow-auto py-6 px-4 md:px-6'>
              <Outlet />
            </main>
            <CreateWorkspaceDialog />
            <CreateProjectDialog />
          </div>
        </SidebarProvider>
      </div>
    </AuthProvider>
  );
};
