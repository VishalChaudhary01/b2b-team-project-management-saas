import { Button } from '@/components/ui/button';
import { Separator } from '../ui/separator';
import { baseURL } from '@/lib/axios-client';
import googleIcon from '@/assets/google-icon.svg';

interface AuthButtonsProps {
  label: string;
  disabled: boolean;
}

export const AuthButtons = ({ label, disabled }: AuthButtonsProps) => {
  const handleClick = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className='flex flex-col gap-2'>
      <Button type='submit' disabled={disabled} className='w-full'>
        {label}
      </Button>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <Separator />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-card px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant='outline'
        type='button'
        className='flex items-center gap-2 w-full'
        onClick={handleClick}
      >
        {label} with Google{' '}
        <img src={googleIcon} alt='Google' className='w-5 h-5' />
      </Button>
    </div>
  );
};
