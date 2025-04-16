import { User } from '@models/User';
import { BadRequestException } from '@utils/appError';

export const getCurrentUserService = async (userId: string) => {
  const user = await User.findById(userId)
    .populate('currentWorkspace')
    .select('-password');

  if (!user) {
    throw new BadRequestException('User not Found');
  }

  return { user };
};
