import { Outlet, useParams } from 'react-router-dom';
import { AuthProvider } from '@/context/auth-provider';
import { Header } from '@/components/common/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar/AppSidebar';
import { CreateWorkspaceDialog } from '@/components/workspace/CreateWorkspaceDialog';
import { CreateProjectDialog } from '@/components/workspace/project/CreateProjectDialog';
import { CreateTaskDialog } from '@/components/workspace/project/task/CreateTaskDialog';

export const AppLayout = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  return (
    <AuthProvider>
      <div className='flex min-h-screen w-full overflow-y-hidden'>
        <SidebarProvider>
          <AppSidebar />
          <div className='flex flex-col w-full'>
            <Header />
            <ScrollArea className='flex-1 max-h-[calc(100vh-30px)]'>
              <main className='py-6 px-4 md:px-6 max-w-7xl mx-auto'>
                <Outlet />
              </main>
            </ScrollArea>
            <CreateWorkspaceDialog />
            <CreateProjectDialog />
            <CreateTaskDialog projectId={projectId || undefined} />
          </div>
        </SidebarProvider>
      </div>
    </AuthProvider>
  );
};
