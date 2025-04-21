import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { editProjectMutationFn } from '@/lib/api';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { EditProjectInput, Project } from '@/types/project.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editProjectSchema } from '@/validators/project.validator';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEditProjectDialog } from '@/hooks/dialog';

export const EditProjectDialog = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { open, onClose } = useEditProjectDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: editProjectMutationFn,
  });

  const form = useForm<EditProjectInput>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: project.name ?? '',
      description: project.description ?? '',
    },
  });

  const onSubmit = (values: EditProjectInput) => {
    if (isPending) return;
    const payload = {
      workspaceId,
      projectId: project._id,
      data: values,
    };
    mutate(payload, {
      onSuccess: (data) => {
        const project = data.project;
        queryClient.invalidateQueries({
          queryKey: ['singleProject', project._id],
        });
        toast.success('Project updated successfully');
        navigate(`/workspace/${workspaceId}/project/${project._id}`);
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create project');
      },
    });
  };

  return (
    <DialogLayout
      open={open}
      onClose={onClose}
      header='Edit Project'
      description='Update the project details to refine task management'
      footer={
        <Button
          type='submit'
          disabled={isPending}
          form='edit-project-form'
          className='w-full'
        >
          {isPending && <Loader className='w-4 h-4 animate-spin' />}
          Update
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id='edit-project-form'
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project title</FormLabel>
                <FormControl>
                  <Input placeholder='Update project name' {...field} />
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
                <FormLabel>Project description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder='Update Projects description'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DialogLayout>
  );
};
