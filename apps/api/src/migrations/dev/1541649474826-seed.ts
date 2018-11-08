import { AuthenticationDomainSchema } from '@nestjs-bff/backend/domain/authentication/model/authentication.domain.schema';
import { AuthorizationDomainSchema } from '@nestjs-bff/backend/domain/authorization/model/authorization.domain.schema';
import { OrganizationDomainSchema } from '@nestjs-bff/backend/domain/organization/model/organization.domain.schema';
import { UserDomainSchema } from '@nestjs-bff/backend/domain/user/model/user.domain.schema';
import { LoggerSysService } from '@nestjs-bff/backend/shared/logging/logger.shared.service';
import { Connection } from 'mongoose';
import { CatDomainSchema } from '../../app/domain/cats/model/cat.domain.schema';
import { data } from './data/seed-data';

/**
 * Make any changes you need to make to the database here
 */
export async function up(connection: Connection, bffLoggerService: LoggerSysService) {
  await connection.model('IUserDomainModel', UserDomainSchema).collection.insertMany(data.users);
  await connection
    .model('IAuthenticationDomainModel', AuthenticationDomainSchema)
    .collection.insertMany(data.authentications);
  await connection
    .model('IOrganizationDomainModel', OrganizationDomainSchema)
    .collection.insertMany(data.organizations);
  await connection.model('IAuthorizationModel', AuthorizationDomainSchema).collection.insertMany(data.authorizations);
  await connection.model('ICatModel', CatDomainSchema).collection.insertMany(data.cats);

  bffLoggerService.info(`UP script completed.`);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down(connection: Connection, bffLoggerService: LoggerSysService) {
  await connection
    .model('IUserDomainModel', UserDomainSchema)
    .collection.deleteMany({ _id: { $in: data.users.map(item => item._id) } });

  await connection
    .model('IAuthenticationDomainModel', AuthenticationDomainSchema)
    .collection.deleteMany({ _id: { $in: data.authentications.map(item => item._id) } });

  await connection
    .model('IOrganizationDomainModel', OrganizationDomainSchema)
    .collection.deleteMany({ _id: { $in: data.organizations.map(item => item._id) } });

  await connection
    .model('IAuthorizationModel', AuthorizationDomainSchema)
    .collection.deleteMany({ _id: { $in: data.authorizations.map(item => item._id) } });

  await connection
    .model('Cat', CatDomainSchema)
    .collection.deleteMany({ _id: { $in: data.cats.map(item => item._id) } });

  bffLoggerService.info(`DOWN script completed.`);
}
