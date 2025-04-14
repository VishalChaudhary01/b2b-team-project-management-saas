import mongoose from 'mongoose';
import { User } from '@models/User';
import { Role } from '@models/Role';
import { Member } from '@models/Member';
import { Account } from '@models/Account';
import { Workspace } from '@models/Workspace';
import { NotFoundException } from '@utils/appError';
import { Roles } from '@enums/role.enum';

export const loginOrCreateAccountService = async (data: {
  provider: string;
  name: string;
  providerId: string;
  profilePicture?: string;
  email?: string;
}) => {
  const { provider, name, providerId, profilePicture = null, email } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log('Session start...');
    let user = await User.findOne({ email }).session(session);
    if (!user) {
      user = new User({
        email,
        name,
        profilePicture,
      });
      await user.save({ session });

      const account = new Account({
        userId: user._id,
        provider,
        providerId,
      });
      await account.save({ session });

      const workspace = new Workspace({
        name: 'My Workspace',
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await Role.findOne({
        name: Roles.OWNER,
      }).session(session);
      if (!ownerRole) {
        throw new NotFoundException('Owner role not found');
      }

      const member = new Member({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log('Session End...');

    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
