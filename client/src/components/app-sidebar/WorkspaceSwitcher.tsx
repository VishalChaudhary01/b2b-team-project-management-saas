import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Loader, Plus } from 'lucide-react';
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useCreateWorkspaceDialog from '@/hooks/use-create-workspace-dialog';
import useGetUserWorkspaces from '@/hooks/api/use-get-user-workspaces';

type ActiveWorkspace = {
  _id: string;
  name: string;
};
export const WorkspaceSwitcher = () => {
  const navigate = useNavigate();
  const { onOpen } = useCreateWorkspaceDialog();
  const workspaceId = useWorkspaceId();
  const [activeWorkspace, setActiveWorkspace] = useState<ActiveWorkspace>();

  const { data, isPending } = useGetUserWorkspaces();
  const workspaces = data?.workspaces;

  useEffect(() => {
    if (workspaces?.length) {
      const workspace = workspaceId
        ? workspaces.find((ws) => ws._id === workspaceId)
        : workspaces[0];

      if (workspace) {
        setActiveWorkspace(workspace);
        if (!workspaceId) navigate(`/workspace/${workspace._id}`);
      }
    }
  }, [workspaceId, workspaces, navigate]);

  const onSelect = (workspace: ActiveWorkspace) => {
    setActiveWorkspace(workspace);
    navigate(`/workspace/${workspace._id}`);
  };

  return (
    <div>
      <SidebarGroupLabel className='flex justify-between pr-0'>
        <span>Workspace</span>
        <button
          onClick={onOpen}
          className='w-6 h-6 flex items-center justify-center rounded-full border-2 cursor-pointer hover:text-primary hover:border-primary transition-all ease-in-out duration-300 p-0'
        >
          <Plus className='w-3.5 h-3.5' />
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size='lg' className='flex items-center'>
                {activeWorkspace ? (
                  <div className='flex gap-2 items-center'>
                    <div className='bg-primary text-background flex items-center justify-center border rounded-md w-9 h-9 text-base font-medium'>
                      {activeWorkspace?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className='flex flex-col'>
                      <span className='truncate text-sm font-medium'>
                        {activeWorkspace?.name}
                      </span>
                      <span className='truncate text-sx'>Free</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span>No Workspace selected</span>
                  </div>
                )}
                <ChevronDown className='w-4 h-4 ml-auto cursor-pointer' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='min-w-56 rounded-md p-2 bg-popover border z-50'
              align='start'
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-sx text-muted-foreground'>
                Workspaces
              </DropdownMenuLabel>
              {isPending ? <Loader className='w-4 h-4 animate-spin' /> : null}
              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => onSelect(workspace)}
                  className='gap-2 p-2 !cursor-pointer flex items-center'
                >
                  <div className='bg-primary text-background flex items-center justify-center border rounded-md w-7 h-7'>
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>
                  {workspace.name}
                  {workspace._id === workspaceId && (
                    <DropdownMenuShortcut>
                      <Check className='w-4 h-4' />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='gap-2 p-2 !cursor-pointer flex items-center justify-center text-muted-foreground font-medium'
                onClick={() =>
                  setTimeout(() => {
                    onOpen();
                  }, 100)
                }
              >
                <Plus className='w-4 h-4' />
                <div className=''>Add workspace</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};
