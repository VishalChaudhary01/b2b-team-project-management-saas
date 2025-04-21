import { Separator } from '@/components/ui/separator';
import { ProjectHeader } from '@/components/workspace/project/ProjectHeader';
import { ProjectAnalytics } from '@/components/workspace/project/ProjectAnalytics';
import { TaskTable } from '@/components/workspace/project/task/TaskTable';

export const ProjectDetailsPage = () => {
  return (
    <div className='w-full space-y-6 py-4 md:pt-3'>
      <ProjectHeader />
      <div className='space-y-5'>
        <ProjectAnalytics />
        <Separator />
        <TaskTable />
      </div>
    </div>
  );
};
