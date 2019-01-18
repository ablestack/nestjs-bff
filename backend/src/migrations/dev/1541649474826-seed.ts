import { AccessPermissionsSchema } from '@nestjs-bff/backend/lib/domain/access-permissions/model/access-permissions.schema';
import { AuthenticationSchema } from '@nestjs-bff/backend/lib/domain/authentication/model/authentication.schema';
import { OrganizationSchema } from '@nestjs-bff/backend/lib/domain/organization/model/organization.schema';
import { UserSchema } from '@nestjs-bff/backend/lib/domain/user/model/user.schema';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Connection } from 'mongoose';
import { data } from './data/seed-data';

/**
 * Make any changes you need to make to the database here
 */
export async function up(connection: Connection, bffLoggerService: LoggerSharedService) {
  await connection.model('IUserModel', UserSchema).collection.insertMany(data.users);
  await connection.model('IAuthenticationModel', AuthenticationSchema).collection.insertMany(data.authentications);
  await connection.model('IOrganizationModel', OrganizationSchema).collection.insertMany(data.organizations);
  await connection.model('IAccessPermissionsModel', AccessPermissionsSchema).collection.insertMany(data.authorizations);

  bffLoggerService.info(`UP script completed.`);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down(connection: Connection, bffLoggerService: LoggerSharedService) {
  await connection
    .model('IUserModel', UserSchema)
    .collection.deleteMany({ id: { $in: data.users.map(item => item.id) } });

  await connection
    .model('IAuthenticationModel', AuthenticationSchema)
    .collection.deleteMany({ id: { $in: data.authentications.map(item => item.id) } });

  await connection
    .model('IOrganizationModel', OrganizationSchema)
    .collection.deleteMany({ id: { $in: data.organizations.map(item => item.id) } });

  await connection
    .model('IAuthorizationModel', AccessPermissionsSchema)
    .collection.deleteMany({ id: { $in: data.authorizations.map(item => item.id) } });

  bffLoggerService.info(`DOWN script completed.`);
}
