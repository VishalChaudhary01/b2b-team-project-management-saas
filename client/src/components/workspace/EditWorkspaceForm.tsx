import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Permissions } from '@/constants';
import { editWorkspaceMutationFn } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { useAuthContext } from '@/context/auth-provider';
import { EditWorkspaceInput } from '@/types/workspace.type';
import { editWorkspaceSchema } from '@/validators/workspace.validator';
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
import { Textarea } from '@/components//ui/textarea';

export default function EditWorkspaceForm() {
  const { workspace, hasPermission } = useAuthContext();
  const canEditWorkspace = hasPermission(Permissions.EDIT_WORKSPACE);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: editWorkspaceMutationFn,
  });

  const form = useForm<EditWorkspaceInput>({
    resolver: zodResolver(editWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (workspace) {
      form.setValue('name', workspace.name);
      form.setValue('description', workspace?.description || '');
    }
  }, [form, workspace]);

  const onSubmit = (values: EditWorkspaceInput) => {
    if (isPending) return;
    const payload = {
      workspaceId: workspaceId,
      data: { ...values },
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['workspace'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-workspaces'],
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ?? 'Failed to Update Workspace'
        );
      },
    });
  };

  return (
    <div className='w-full h-auto max-w-full'>
      <div className='h-full'>
        <div className='mb-5 border-b'>
          <h1
            className='text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left'
          >
            Edit Workspace
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter workspace name'
                      disabled={!canEditWorkspace}
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
                  <FormLabel>
                    Workspace description
                    <span className='text-xs font-extralight ml-2'>
                      Optional
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      disabled={!canEditWorkspace}
                      placeholder='Enter description of workspace.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {canEditWorkspace && (
              <Button
                className='flex place-self-end mt-2'
                disabled={isPending}
                type='submit'
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  'Update Workspace'
                )}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
