import { Project } from '@/types/project.type';
import { Member } from '@/types/workspace.type';
import { getAvatarColor, getAvatarFallbackText } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const getProjectOptions = (projects: Project[]) => {
  const projectOptions = projects?.map((project) => {
    return {
      label: <div>{project.name}</div>,
      value: project._id,
    };
  });

  return projectOptions;
};

export const getMemberOptions = (members: Member[]) => {
  const assigneesOptions = members?.map((member) => {
    const name = member.userId?.name || 'Unknown';
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);

    return {
      label: (
        <div className='flex items-center space-x-2'>
          <Avatar className='h-7 w-7'>
            <AvatarImage src={member.userId?.profilePicture || ''} alt={name} />
            <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      ),
      value: member.userId._id,
    };
  });

  return assigneesOptions;
};
