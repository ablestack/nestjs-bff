import { JwtTokenService } from '../../src/host/http/core/jwt/jwt-token.service';

export const setupTestDataJwtTokens = async (nestJsBffConfig: any, testData: any) => {
  const jwtTokenService = new JwtTokenService(nestJsBffConfig);

  testData.orgA.users.adminUser.jwt = await jwtTokenService.createToken(testData.orgA.users.adminUser.accessPermissionsEntity);
  testData.orgA.users.regularUser.jwt = await jwtTokenService.createToken(testData.orgA.users.regularUser.accessPermissionsEntity);
  testData.orgB.users.adminUser.jwt = await jwtTokenService.createToken(testData.orgB.users.adminUser.accessPermissionsEntity);
  testData.orgC.users.groupAdminUser.jwt = await jwtTokenService.createToken(testData.orgC.users.groupAdminUser.accessPermissionsEntity);
};
