import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PasswordInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
}

export const PasswordInput = ({
  form,
  name,
  label,
  placeholder,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className='relative'>
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='absolute top-0.5 right-0.5'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
