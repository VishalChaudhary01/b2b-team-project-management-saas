import { format } from 'date-fns';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { useGetProjectsInWorkspace } from '@/hooks/api';
import { getAvatarColor, getAvatarFallbackText } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProjectsInWorkspace({
    workspaceId,
    pageNumber: 1,
    pageSize: 10,
  });

  const projects = data?.projects || [];

  return (
    <div className='flex flex-col pt-2'>
      {isPending ? (
        <Loader className='w-8 h-8 animate-spin place-self-center flex' />
      ) : projects?.length === 0 ? (
        <div className='font-semibold text-sm text-muted-foreground text-center py-5'>
          No Project created yet
        </div>
      ) : (
        <ul role='list' className='space-y-2 divide-y divide-border/50'>
          {projects.map((project) => {
            const name = project.createdBy.name;
            const initials = getAvatarFallbackText(name);
            const avatarColor = getAvatarColor(name);

            return (
              <li
                key={project._id}
                role='listitem'
                className='cursor-pointer p-2 md:px-4 hover:bg-gray-50 transition-colors ease-in-out duration-200 rounded-md'
              >
                <Link
                  to={`/workspace/${workspaceId}/project/${project._id}`}
                  className='grid gap-8 p-0'
                >
                  <div className='flex items-center justify-start gap-2'>
                    <img src='/bar-chart.svg' className='w-6 h-6' />
                    <div className='grid gap-1'>
                      <p className='text-sm font-medium leading-none'>
                        {project.name}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {project.createdAt
                          ? format(project.createdAt, 'PPP')
                          : null}
                      </p>
                    </div>
                    <div className='ml-auto flex items-center gap-4'>
                      <span className='text-sm text-muted-foreground'>
                        Created by
                      </span>
                      <Avatar className='hidden h-9 w-9 sm:flex'>
                        <AvatarImage
                          src={project.createdBy.profilePicture || ''}
                          alt='Avatar'
                        />
                        <AvatarFallback className={avatarColor}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
