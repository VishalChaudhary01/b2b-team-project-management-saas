import { useState } from 'react';
import { toast } from 'sonner';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Permissions } from '@/constants';
import { Pagination } from '@/types/common.type';
import { deleteProjectMutationFn } from '@/lib/api';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useConfirmDialog from '@/hooks/use-confirm-dialog';
import useCreateProjectDialog from '@/hooks/use-create-project-dialog';
import useGetProjectsInWorkspaceQuery from '@/hooks/api/use-get-projects';
import {
  ArrowRight,
  Folder,
  Loader,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { DialogLayout } from '@/components/common/DialogLayout';
import { PermissionsGuard } from '@/components/common/PermissionGuard';
import { ScrollArea } from '../ui/scroll-area';

export function NavProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { isMobile } = useSidebar();
  const { onOpen } = useCreateProjectDialog();

  const {
    content,
    open,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useConfirmDialog();

  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { data, isPending, isFetching, isError } =
    useGetProjectsInWorkspaceQuery({
      workspaceId,
      pageSize,
      pageNumber,
    });

  const projects = data?.projects || [];
  const pagination = data?.pagination || ({} as Pagination);
  const hasMore = pagination?.totalPages > pageNumber;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 5);
  };

  const handleDelete = () => {
    if (!content) return;
    mutate(
      { workspaceId, projectId: content?._id },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['allProjects', workspaceId],
          });
          toast.success(data.message || 'Project deleted successfully');

          navigate(`/workspace/${workspaceId}`);
          setTimeout(() => onCloseDialog(), 100);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(error?.response?.data?.message ?? 'Something went wrong');
        },
      }
    );
  };

  return (
    <>
      <SidebarGroup className='flex-1 min-h-0'>
        <SidebarGroupLabel className='w-full justify-between pr-0'>
          <span>Projects</span>
          <PermissionsGuard requiredPermission={Permissions.CREATE_PROJECT}>
            <button
              onClick={onOpen}
              className='w-6 h-6 flex items-center justify-center rounded-full border-2 cursor-pointer hover:text-primary hover:border-primary transition-all ease-in-out duration-300 p-0'
            >
              <Plus className='w-3.5 h-3.5' />
            </button>
          </PermissionsGuard>
        </SidebarGroupLabel>
        <ScrollArea className='h-[calc(100vh-24rem)]'>
          <SidebarMenu className='px-2'>
            {isError ? <div>Error occured</div> : null}
            {isPending ? (
              <Loader className='w-5 h-5 animate-spin place-self-center' />
            ) : null}

            {!isPending && projects?.length === 0 ? (
              <div className='pl-3'>
                <p className='text-xs text-muted-foreground'>
                  There is no projects in this Workspace yet. Projects you
                  create will show up here.
                </p>
                <PermissionsGuard
                  requiredPermission={Permissions.CREATE_PROJECT}
                >
                  <Button
                    variant='link'
                    type='button'
                    className='h-0 p-0 text-[13px] underline font-semibold mt-4'
                    onClick={onOpen}
                  >
                    Create a project
                    <ArrowRight />
                  </Button>
                </PermissionsGuard>
              </div>
            ) : (
              projects.map((item) => {
                const projectUrl = `/workspace/${workspaceId}/project/${item._id}`;

                return (
                  <SidebarMenuItem key={item._id}>
                    <SidebarMenuButton
                      asChild
                      isActive={projectUrl === pathname}
                    >
                      <Link to={projectUrl}>
                        <img src='/bar-chart.svg' alt='P' className='w-6 h-6' />
                        <span className='text-base '>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontal className='w-4 h-4 cursor-pointer' />
                          <span className='sr-only'>More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className='min-w-56 rounded-md p-2'
                        side={isMobile ? 'bottom' : 'right'}
                        align={isMobile ? 'end' : 'start'}
                      >
                        <DropdownMenuItem
                          onClick={() => navigate(`${projectUrl}`)}
                        >
                          <Folder className='w-4 h-4' />
                          <span>View Project</span>
                        </DropdownMenuItem>

                        <PermissionsGuard
                          requiredPermission={Permissions.DELETE_PROJECT}
                        >
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() =>
                              setTimeout(() => onOpenDialog(item), 100)
                            }
                          >
                            <Trash2 className='w-4 h-4' />
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </PermissionsGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              })
            )}

            {hasMore && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className='text-sidebar-foreground/70'
                  disabled={isFetching}
                  onClick={fetchNextPage}
                >
                  <MoreHorizontal className='text-sidebar-foreground/70' />
                  <span>{isFetching ? 'Loading...' : 'More'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>

      <DialogLayout
        open={open}
        onClose={onCloseDialog}
        header='Delete Project'
        description={`Are you sure you want to delete ${
          content?.name || 'this item'
        }? This action cannot be undone.`}
      >
        <div className='w-full flex justify-center gap-8'>
          <Button
            disabled={isLoading}
            onClick={onCloseDialog}
            variant='outline'
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleDelete}>
            {isLoading ? <Loader className='animate-spin' /> : 'Delete'}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
}
