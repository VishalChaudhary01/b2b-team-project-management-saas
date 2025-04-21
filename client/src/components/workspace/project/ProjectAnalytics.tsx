import { useParams } from 'react-router-dom';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { AnalyticsCard } from '@/components/common/AnalyticsCard';
import { useGetProjectAnalytics } from '@/hooks/api';

export const ProjectAnalytics = () => {
  const param = useParams();
  const workspaceId = useWorkspaceId();
  const projectId = param.projectId as string;
  const { data, isPending } = useGetProjectAnalytics(workspaceId, projectId);
  const analytics = data?.analytics;

  return (
    <div className='grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3'>
      <AnalyticsCard
        isLoading={isPending}
        title='Total Task'
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title='Overdue Task'
        value={analytics?.overdueTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title='Completed Task'
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};
