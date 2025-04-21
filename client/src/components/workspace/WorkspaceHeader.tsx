import { Loader } from 'lucide-react';
import { useAuthContext } from '@/context/auth-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const WorkspaceHeader = () => {
  const { workspaceLoading, workspace } = useAuthContext();
  return (
    <div className='w-full max-w-3xl mx-auto pb-2'>
      {workspaceLoading ? (
        <div className='w-full flex items-center justify-center'>
          <Loader className='w-8 h-8 animate-spin place-self-center flex' />
        </div>
      ) : (
        <div className='flex items-center gap-4'>
          <Avatar className='size-[42px] rounded-lg'>
            <AvatarFallback className='rounded-lg text-xl font-bold md:text-3xl bg-primary text-primary-foreground'>
              {workspace?.name?.split(' ')?.[0]?.charAt(0).toUpperCase() || 'W'}
            </AvatarFallback>
          </Avatar>
          <div className='grid flex-1 text-left leading-tight'>
            <span className='truncate capitalize font-semibold text-xl'>
              {workspace?.name}
            </span>
            <span className='truncate text-sm'>Free</span>
          </div>
        </div>
      )}
    </div>
  );
};
