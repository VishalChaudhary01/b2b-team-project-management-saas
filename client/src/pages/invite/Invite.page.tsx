import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/api';
import { BASE_ROUTE } from '@/routes/common/routePath';
import { invitedUserJoinWorkspaceMutationFn } from '@/lib/api';
import { CardLayout } from '@/components/common/CardLayout';
import { Button } from '@/components/ui/button';

export const InvitePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const param = useParams();
  const inviteCode = param.inviteCode as string;

  const { data: authData, isPending } = useAuth();
  const user = authData?.user;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
  });

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(':inviteCode', inviteCode)}`
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutate(inviteCode, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ['userWorkspaces'],
        });
        navigate(`/workspace/${data.workspaceId}`);
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
    <div className='flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='flex w-full max-w-md flex-col gap-6'>
        <Link
          to='/'
          className='flex items-center gap-2 self-center font-semibold text-base'
        >
          CrewSpace
        </Link>
        <div className='flex flex-col gap-6'>
          <CardLayout
            header='Hey there! You are invited to join a CrewSpace Workspace!'
            description='Looks like you need to be logged into your CrewSpace account to
                join this Workspace.'
          >
            {isPending ? (
              <Loader className='w-8 h-8 animate-spin place-self-center flex' />
            ) : (
              <div>
                {user ? (
                  <div className='flex items-center justify-center my-3'>
                    <form onSubmit={handleSubmit}>
                      <Button
                        type='submit'
                        disabled={isLoading}
                        className='!bg-green-600 !text-white'
                      >
                        {isLoading ? (
                          <Loader className='w-4 h-4 animate-spin' />
                        ) : (
                          'Join the Workspace'
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className='flex flex-col md:flex-row items-center gap-2'>
                    <Link
                      className='flex-1 w-full text-base'
                      to={`/sign-up?returnUrl=${returnUrl}`}
                    >
                      <Button className='w-full'>Signup</Button>
                    </Link>
                    <Link
                      className='flex-1 w-full text-base'
                      to={`/?returnUrl=${returnUrl}`}
                    >
                      <Button variant='secondary' className='w-full border'>
                        Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardLayout>
        </div>
      </div>
    </div>
  );
};
