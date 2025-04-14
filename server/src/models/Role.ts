import mongoose, { Schema, Document } from 'mongoose';
import { RolePermissions } from '@utils/role-permission';
import { PermissionType, Roles, RoleType } from '@enums/role.enum';

export interface RoleDocument extends Document {
  name: RoleType;
  permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermissions[this.name];
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Role = mongoose.model<RoleDocument>('Role', roleSchema);
