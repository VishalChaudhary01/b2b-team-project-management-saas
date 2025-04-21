import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProjectMutationFn } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { CreateProjectInput } from '@/types/project.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProjectSchema } from '@/validators/project.validator';
import { useCreateProjectDialog } from '@/hooks/dialog';
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

export const CreateProjectDialog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { open, onClose } = useCreateProjectDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: createProjectMutationFn,
  });

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (values: CreateProjectInput) => {
    if (isPending) return;
    const payload = {
      workspaceId,
      data: values,
    };
    mutate(payload, {
      onSuccess: (data) => {
        const project = data.project;
        queryClient.invalidateQueries({
          queryKey: ['allProjects', workspaceId],
        });
        toast.success('Project created successfully');
        navigate(`/workspace/${workspaceId}/project/${project._id}`);
        setTimeout(() => onClose(), 100);
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
      header='Add New Project'
      description='Organize and manage tasks, resources, and team collaboration'
      footer={
        <Button
          type='submit'
          disabled={isPending}
          form='create-project-form'
          className='w-full'
        >
          {isPending && <Loader className='w-4 h-4 animate-spin' />}
          Create
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id='create-project-form'
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter project name' {...field} />
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
                    placeholder='Enter Projects description'
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
