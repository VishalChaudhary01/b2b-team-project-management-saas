import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutMutationFn } from '@/lib/api';
import {
  AudioWaveform,
  EllipsisIcon,
  File,
  Loader,
  LogOut,
} from 'lucide-react';
import useAuth from '@/hooks/api/use-auth';
import useWorkspaceId from '@/hooks/use-workspace-id';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NavProjects } from '@/components/app-sidebar/NavProjects';
import { WorkspaceSwitcher } from '@/components/app-sidebar/WorkspaceSwitcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavMain } from './NavMain';
import { DialogLayout } from '../common/DialogLayout';

export const AppSidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['authUser'],
      });
      navigate('/');
      setIsOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Filed to Log out');
    },
  });

  const handleLogout = useCallback(() => {
    if (isPending) return;
    mutate();
  }, [isPending, mutate]);

  return (
    <>
      <Sidebar className=''>
        <SidebarHeader>
          <Link
            to={`/workspace/${workspaceId}`}
            className='flex items-center justify-start gap-2'
          >
            <Button size='sm'>
              <AudioWaveform width={16} height={16} />
            </Button>
            <span className='font-medium text-md'>Team Sync.</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className='flex flex-col gap-0 h-[calc(100vh-8rem)] overflow-y-hidden'>
          <SidebarGroup className='flex-shrink-0'>
            <SidebarGroupContent>
              <WorkspaceSwitcher />
              <Separator />
              <NavMain />
              <Separator />
            </SidebarGroupContent>
          </SidebarGroup>
          <NavProjects />
        </SidebarContent>
        <SidebarFooter className='border-t'>
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <Loader className='w-8 h-8 animate-spin' />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className='flex gap-2 items-center justify-start h-[52px] cursor-pointer'>
                      <Avatar className='w-8 h-8'>
                        <AvatarImage src={data?.user?.profilePicture ?? ''} />
                        <AvatarFallback className='rounded-full bg-primary text-primary-foreground'>
                          {data?.user?.name
                            ?.split(' ')?.[0]
                            ?.charAt(0)
                            .toUpperCase()}
                          {data?.user?.name
                            ?.split(' ')?.[1]
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='truncate text-base font-medium'>
                          {data?.user?.name}
                        </span>
                        <span className='truncate text-sx'>
                          {data?.user?.email}
                        </span>
                      </div>
                      <EllipsisIcon className='ml-auto w-4 h-4' />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <File className='w-4 h-4' />
                        Profile
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setTimeout(() => setIsOpen(true), 100)}
                    >
                      <LogOut className='w-4 h-4' />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <DialogLayout
        open={isOpen}
        onClose={() => setIsOpen(false)}
        header='Are you sure you want to log out?'
        description='This will end your current session and you will need to log in
              again to access your account.'
      >
        <div className='flex gap-4 justify-center'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={isPending} type='button' onClick={handleLogout}>
            {isPending ? <Loader className='animate-spin' /> : 'Sign out'}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
};
