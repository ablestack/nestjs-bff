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

const logger = getLogger();

export const setupAuth = async globalConfig => {
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

  // testData.orgA.users.adminUser.jwt = await jwtTokenService.createToken(testData.orgA.users.adminUser.accessPermissionsEntity);

  logger.debug(
    'created OrgA userA ------------------------------------------------------------------',
    JSON.stringify(testData.orgA.users.adminUser, null, 2),
  );

  logger.info(
    `Users Created: ----------------------------------------------
    ${testData.orgA.users.adminUser.userEntity.username}, 
    ${testData.orgA.users.regularUser.userEntity.username},
    ${testData.orgB.users.adminUser.userEntity.username},
    ${testData.orgC.users.groupAdminUser.userEntity.username},
    ${testData.orgZ.users.systemAdminUser.userEntity.username}`,
  );
};
