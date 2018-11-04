import {
  OrganizationRoles,
  Roles,
} from '@nestjs-bff/universal/constants/roles.constants';
import { Schema } from 'mongoose';

const OrganizationAuthorizationDomainSchema: Schema = new Schema({
  primary: {
    type: Schema.Types.Boolean,
    required: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  organizationRoles: {
    type: [Schema.Types.String],
    enum: [OrganizationRoles.member, OrganizationRoles.admin],
    required: true,
  },
});

export const AuthorizationDomainSchema: Schema = new Schema(
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
      type: [OrganizationAuthorizationDomainSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
