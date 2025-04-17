import mongoose from 'mongoose';
import { User } from '@models/User';
import { Role } from '@models/Role';
import { Member } from '@models/Member';
import { Account } from '@models/Account';
import { Workspace } from '@models/Workspace';
import {
  AppError,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@utils/appError';
import { Roles } from '@enums/role.enum';
import { AccountProviderEnum } from '@enums/account-provider.enum';

interface RegisterUserInput {
  email: string;
  name: string;
  password: string;
}

interface VerifyUserService {
  email: string;
  password: string;
  provider?: string;
}

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

export const registerUserService = async (inputs: RegisterUserInput) => {
  const { name, email, password } = inputs;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const user = new User({
      name,
      email,
      password,
    });
    await user.save({ session });

    const account = new Account({
      userId: user._id,
      provider: AccountProviderEnum.EMAIL,
      providerId: email,
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

    await session.commitTransaction();
    session.endSession();

    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError('Failed to register user');
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = AccountProviderEnum.EMAIL,
}: VerifyUserService) => {
  const account = await Account.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException('Invalid email or password');
  }

  const user = await User.findById(account.userId);

  if (!user) {
    throw new NotFoundException('User not found for the given account');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  return user.omitPassword();
};
