import React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type CardLayoutProps = {
  children: React.ReactNode;
  header: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
};

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  header,
  description,
  footer,
  className,
}) => {
  return (
    <Card className={cn('min-w-[350px] max-w-[700px]', className)}>
      <CardHeader>
        <CardTitle className='text-2xl md:text-3xl font-bold text-center'>
          {header}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className='flex justify-center text-sm text-muted-foreground'>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};
