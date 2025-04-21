import { Outlet } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

export const BaseLayout = () => {
  return (
    <div className='flex min-h-screen w-full max-w-[1440px] mx-auto overflow-hidden'>
      <ScrollArea className='flex-1 pr-4 max-h-screen'>
        <Outlet />
      </ScrollArea>
    </div>
  );
};
