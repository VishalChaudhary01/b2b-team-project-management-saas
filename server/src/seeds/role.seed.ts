import 'dotenv/config';
import mongoose from 'mongoose';
import { Role } from '@models/Role';
import { connectDatabase } from '@config/db.config';
import { RolePermissions } from '@utils/role-permission';

const seedRoles = async () => {
  console.log('🌱 Seeding roles....');
  await connectDatabase();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log('🧹 Clearing existing roles...');
    await Role.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permission = RolePermissions[role];

      const newRole = new Role({
        name: role,
        permissions: permission,
      });
      await newRole.save({ session });
      console.log(`✅ Role ${role} added with permissions.`);
    }

    await session.commitTransaction();
    session.endSession();
    console.log('🎉 Role Seeding completed!');
    process.exit(0);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error during Role seed:', error);
    process.exit(1);
  }
};

seedRoles().catch((error) =>
  console.error('❌ Error during Role seed: ', error)
);
