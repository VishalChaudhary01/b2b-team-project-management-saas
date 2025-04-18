import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type CustomCardProps = {
  children: React.ReactNode;
  header: string;
  description?: string;
  footer?: React.ReactNode;
};

export const CustomCard = ({
  children,
  header,
  description,
  footer,
}: CustomCardProps) => {
  return (
    <Card className='min-w-[350px] max-w-[700px]'>
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
