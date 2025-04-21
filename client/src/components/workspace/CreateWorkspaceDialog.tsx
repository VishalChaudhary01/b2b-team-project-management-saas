import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkspaceMutationFn } from '@/lib/api';
import { CreateWorkspaceInput } from '@/types/workspace.type';
import { createWorkspaceSchema } from '@/validators/workspace.validator';
import { useCreateWorkspaceDialog } from '@/hooks/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogLayout } from '@/components/common/DialogLayout';

export const CreateWorkspaceDialog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkspaceMutationFn,
  });

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (values: CreateWorkspaceInput) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['userWorkspaces'],
        });
        toast.success('Workspace created successfully');
        setTimeout(() => {
          onClose();
        }, 100);
        if (data?.workspace?._id) navigate(`/workspace/${data.workspace?._id}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ?? 'Failed to create new workspace'
        );
      },
    });
  };
  const { open, onClose } = useCreateWorkspaceDialog();

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      header='Create New Workspace'
      description=' Boost your productivity by making it easier for everyone to access
            projects in one location.'
      footer={
        <Button
          type='submit'
          disabled={isPending}
          form='create-workspace-form'
          className='w-full'
        >
          {isPending ? (
            <Loader className='w-4 h-4 animate-spin' />
          ) : (
            'Create Workspace'
          )}
        </Button>
      }
    >
      <Form {...form}>
        <form
          id='create-workspace-form'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Workspace name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter name of your new workspace'
                      className='!h-[48px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>
                    Workspace Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder='Enter description of your new workspace'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </DialogLayout>
  );
};
