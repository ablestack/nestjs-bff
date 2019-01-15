import { AccessPermissionsRepo } from '@nestjs-bff/backend/lib/domain/access-permissions/repo/access-permissions.repo';
import {
  AuthenticationEntity,
  FacebookAuth,
  GoogleAuth,
  LocalAuth,
  TwitterAuth,
} from '@nestjs-bff/backend/lib/domain/authentication/model/authentication.entity';
import { AuthenticationRepo } from '@nestjs-bff/backend/lib/domain/authentication/repo/authentication.repo';
import { OrganizationRepo } from '@nestjs-bff/backend/lib/domain/organization/repo/organization.repo';
import { UserRepo } from '@nestjs-bff/backend/lib/domain/user/repo/user.repo';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { INestApplication } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { AuthE2eModule } from '../auth/auth-e2e.module';
import { testData } from '../shared/test-object-literals.constants';

const authInitializer = new AuthenticationEntity();
authInitializer.local = new LocalAuth();
authInitializer.google = new GoogleAuth();
authInitializer.facebook = new FacebookAuth();
authInitializer.twitter = new TwitterAuth();

export const setupAuth = async globalConfig => {
  const logger = getLogger();
  //
  // Setup
  //
  const module = await Test.createTestingModule({
    imports: [AuthE2eModule],
  }).compile();

  const app: INestApplication = module.createNestApplication();
  await app.init();

  const authenticationRepo: AuthenticationRepo = await app.get(AuthenticationRepo);
  const organizationRepo: OrganizationRepo = await app.get(OrganizationRepo);
  const userRepo: UserRepo = await app.get(UserRepo);
  const accessPermissionsRepo: AccessPermissionsRepo = await app.get(AccessPermissionsRepo);

  //
  // Add Data
  //

  // OrgA
  await organizationRepo.create(testData.orgA.orgEntity, { skipAuthorization: true });

  // OrgA Admin User
  await userRepo.create(testData.orgA.users.adminUser.userEntity, { skipAuthorization: true });
  await authenticationRepo.create(testData.orgA.users.adminUser.authenticationEntity, { skipAuthorization: true });
  await accessPermissionsRepo.create(testData.orgA.users.adminUser.accessPermissionsEntity, {
    skipAuthorization: true,
  });

  // OrgA Regular User
  await userRepo.create(testData.orgA.users.regularUser.userEntity, { skipAuthorization: true });
  await authenticationRepo.create(testData.orgA.users.regularUser.authenticationEntity, { skipAuthorization: true });
  await accessPermissionsRepo.create(testData.orgA.users.regularUser.accessPermissionsEntity, {
    skipAuthorization: true,
  });

  // OrgA
  await organizationRepo.create(testData.orgB.orgEntity, { skipAuthorization: true });

  // OrgB Admin User
  await userRepo.create(testData.orgB.users.adminUser.userEntity, { skipAuthorization: true });
  await authenticationRepo.create(testData.orgB.users.adminUser.authenticationEntity, { skipAuthorization: true });
  await accessPermissionsRepo.create(testData.orgB.users.adminUser.accessPermissionsEntity, {
    skipAuthorization: true,
  });

  // OrgC
  await organizationRepo.create(testData.orgC.orgEntity, { skipAuthorization: true });

  // OrgC GroupAdmin User
  await userRepo.create(testData.orgC.users.groupAdminUser.userEntity, { skipAuthorization: true });
  await authenticationRepo.create(testData.orgC.users.groupAdminUser.authenticationEntity, { skipAuthorization: true });
  await accessPermissionsRepo.create(testData.orgC.users.groupAdminUser.accessPermissionsEntity, {
    skipAuthorization: true,
  });

  // OrgZ
  await organizationRepo.create(testData.orgZ.orgEntity, { skipAuthorization: true });

  // OrgZ SystemAdmin User
  await userRepo.create(testData.orgZ.users.systemAdminUser.userEntity, { skipAuthorization: true });
  await accessPermissionsRepo.create(testData.orgZ.users.systemAdminUser.accessPermissionsEntity, {
    skipAuthorization: true,
  });

  logger.info(
    `Users Created: ----------------------------------------------
    ${testData.orgA.users.adminUser.userEntity.username}, 
    ${testData.orgA.users.regularUser.userEntity.username},
    ${testData.orgB.users.adminUser.userEntity.username},
    ${testData.orgC.users.groupAdminUser.userEntity.username},
    ${testData.orgZ.users.systemAdminUser.userEntity.username}`,
  );
};
