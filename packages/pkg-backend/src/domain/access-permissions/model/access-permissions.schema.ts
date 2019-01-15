import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { Schema } from 'mongoose';

const UserOrgPermissionsSchema: Schema = new Schema({
  primary: {
    type: Schema.Types.Boolean,
    required: true,
  },
  orgId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  organizationRoles: {
    type: [Schema.Types.String],
    enum: [OrganizationRoles.member, OrganizationRoles.admin, OrganizationRoles.facilitator],
    required: true,
  },
});

export const AccessPermissionsSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    roles: {
      type: [Schema.Types.String],
      enum: [Roles.user, Roles.groupAdmin, Roles.systemAdmin],
      required: true,
    },
    organizations: {
      type: [UserOrgPermissionsSchema],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'accesspermissions',
  },
);
