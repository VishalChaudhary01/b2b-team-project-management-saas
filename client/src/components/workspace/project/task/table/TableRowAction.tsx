import { Row } from '@tanstack/react-table';
import { Loader, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { deleteTaskMutationFn } from '@/lib/api';
import { Task } from '@/types/task.type';
import { toast } from 'sonner';
import { DialogLayout } from '@/components/common/DialogLayout';
import { useConfirmDialog } from '@/hooks/dialog';

interface DataTableRowActionsProps {
  row: Row<Task>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { open, onOpen, onClose } = useConfirmDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskMutationFn,
  });

  const taskId = row.original._id as string;
  const taskCode = row.original.taskCode;

  const handleDelete = () => {
    mutate(
      {
        workspaceId,
        taskId,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['all-tasks', workspaceId],
          });
          toast(data.message);
          setTimeout(() => onClose(), 100);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast(error?.response?.data?.message || 'Failed to fetch all tasks');
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem className='cursor-pointer'>
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`!text-destructive cursor-pointer ${taskId}`}
            onClick={() => onOpen(true)}
          >
            Delete Task
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogLayout
        open={open}
        onClose={onClose}
        header={`Delete Task ${taskCode}`}
        description='Are you sure you want to delete.'
      >
        <div className='flex gap-4 justify-center'>
          <Button type='button' variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isPending} type='button' onClick={handleDelete}>
            {isPending ? <Loader className='w-4 h-4 animate-spin' /> : 'Delete'}
          </Button>
        </div>
      </DialogLayout>
    </>
  );
}
