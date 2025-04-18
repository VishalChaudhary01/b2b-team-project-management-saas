import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginMutationFn } from '@/lib/api';
import { LoginInput } from '@/types/user.type';
import { loginSchema } from '@/validators/auth.validator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomCard } from '@/components/custom/CustomCard';
import { PasswordInput } from '@/components/custom/PasswordInput';
import { AuthButtons } from '@/components/custom/AuthButtons';

export const SignInPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: LoginInput) {
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        navigate(decodedUrl || `/workspace/${user.currentWorkspace}`);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.log('Error at form:: ', error);
        toast.error(error.response.data.message || 'Failed to login');
      },
    });
  }

  return (
    <div className='flex justify-center py-8 mx-auto'>
      <CustomCard
        header='SignIn'
        description='Welcome back, please enter your details to login.'
        footer={
          <div>
            Don't have an account?{' '}
            <a href='/sign-up' className='text-primary hover:underline'>
              Sign Up
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
            <AuthButtons label='Sign In' disabled={isPending} />
          </form>
        </Form>
      </CustomCard>
    </div>
  );
};
