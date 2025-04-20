import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { registerMutationFn } from '@/lib/api';
import { RegisterInput } from '@/types/user.type';
import { registerSchema } from '@/validators/auth.validator';
import { CardLayout } from '@/components/common/CardLayout';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { PasswordInput } from '@/components/auth/PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({ mutationFn: registerMutationFn });

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: RegisterInput) {
    if (isPending) return;
    mutate(values, {
      onSuccess: () => {
        navigate('/');
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.error(error);
        toast.error(error.response.data.message || 'Failed to register');
      },
    });
  }

  return (
    <div className='flex justify-center py-8 mx-auto'>
      <CardLayout
        header='SignUp'
        description='Welcome, please enter your details to Create an account.'
        footer={
          <div>
            Already have an account?{' '}
            <a href='/' className='text-primary hover:underline'>
              Sign In
            </a>
          </div>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your full name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email address' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordInput
              form={form}
              name='password'
              label='Password'
              placeholder='Enter your password'
            />
            <PasswordInput
              form={form}
              name='confirmPassword'
              label='Confirm Password'
              placeholder='Confirm your password'
            />
            <AuthButtons label='Sign Up' isLoading={isPending} />
          </form>
        </Form>
      </CardLayout>
    </div>
  );
};
