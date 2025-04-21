import { Permissions } from '@/constants';
import { withPermission } from '@/hoc/with-permission';
import { Separator } from '@/components/ui/separator';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import EditWorkspaceForm from '@/components/workspace/EditWorkspaceForm';
import { DeleteWorkspaceCard } from '@/components/workspace/DeleteWorkspaceCard';

const Settings = () => {
  return (
    <div className='w-full h-auto py-2'>
      <WorkspaceHeader />
      <Separator className='my-4 ' />
      <main>
        <div className='w-full max-w-3xl mx-auto py-3'>
          <h2 className='text-[20px] leading-[30px] font-semibold mb-3'>
            Workspace settings
          </h2>

          <div className='flex flex-col pt-0.5 px-0 '>
            <div className='pt-2'>
              <EditWorkspaceForm />
            </div>
            <div className='pt-2'>
              <DeleteWorkspaceCard />
              delete workspave card
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const SettingsPage = withPermission(
  Settings,
  Permissions.MANAGE_WORKSPACE_SETTINGS
);
