import { Outlet } from 'react-router-dom';

export const BaseLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
