import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/context/auth-provider';
import { deleteWorkspaceMutationFn } from '@/lib/api';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { useConfirmDialog } from '@/hooks/dialog';
import { Permissions } from '@/constants';
import { Button } from '@/components/ui/button';
import { DialogLayout } from '@/components/common/DialogLayout';
import { PermissionsGuard } from '@/components/common/PermissionGuard';

export const DeleteWorkspaceCard = () => {
  const { workspace } = useAuthContext();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const {
    open,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useConfirmDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkspaceMutationFn,
  });

  const handleDelete = () => {
    mutate(workspaceId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['userWorkspaces'],
        });
        navigate(`/workspace/${data.currentWorkspace}`);
        setTimeout(() => onCloseDialog(), 100);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ?? 'Failed to Delete Wrokspace'
        );
      },
    });
  };

  return (
    <>
      <div className='w-full'>
        <div className='mb-5 border-b'>
          <h1
            className='text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left'
          >
            Delete Workspace
          </h1>
        </div>

        <PermissionsGuard
          showMessage
          requiredPermission={Permissions.DELETE_WORKSPACE}
        >
          <div className='flex flex-col items-start justify-between py-0'>
            <div className='flex-1 mb-2'>
              <p>
                Deleting a workspace is a permanent action and cannot be undone.
                Once you delete a workspace, all its associated data, including
                projects, tasks, and member roles, will be permanently removed.
                Please proceed with caution and ensure this action is
                intentional.
              </p>
            </div>
            <Button
              className='flex place-self-end'
              variant='destructive'
              onClick={onOpenDialog}
            >
              Delete Workspace
            </Button>
          </div>
        </PermissionsGuard>
      </div>

      <DialogLayout
        open={open}
        onClose={onCloseDialog}
        header={`Delete  ${workspace?.name} Workspace`}
        description={`Are you sure you want to delete? This action cannot be undone.`}
      >
        <div className='w-full flex justify-center gap-8'>
          <Button
            disabled={isPending}
            onClick={onCloseDialog}
            variant='outline'
          >
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleDelete}>
            {isPending ? <Loader className='w-4 h-4 animate-spin' /> : 'Delete'}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
};
