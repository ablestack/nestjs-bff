import { LocalAuthenticateCommand } from '@nestjs-bff/global/lib/application/auth/local-authenticate.command';
import { LocalRegisterCommand } from '@nestjs-bff/global/lib/application/auth/local-register.command';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/shared/authorization/roles.constants';
import { AccessPermissionsContract } from '@nestjs-bff/global/lib/domain/access-permissions/access-permissions.contract';
import { IAuthenticationToken } from '@nestjs-bff/global/lib/shared/authentication/authentication-token.interface';
import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { UserAuthService } from '../../../../application/user-auth/user-auth.service';
import { INestjsBffConfig } from '../../../../config/nestjs-bff.config';
import { FacebookAuthenticationService } from '../../../../domain/authentication/social/facebook-authentication.service';
import { AppSharedProviderTokens } from '../../../../shared/app/app.shared.constants';
import { OrgRolesAuthCheck } from '../../../../shared/authchecks/org-roles.authcheck';
import { RoleAuthCheck } from '../../../../shared/authchecks/role.authcheck';
import { Authorization } from '../../core/decorators/authorization.decorator';
import { JwtTokenService } from '../../core/jwt/jwt-token.service';
import { BffRequest } from '../../core/types/bff-request.contract';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AppSharedProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly authFacebookService: FacebookAuthenticationService,
    private readonly userAuthenticationService: UserAuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @Post('public/local/signup')
  async localSignUp(@Body() localRegisterCmd: LocalRegisterCommand): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signUpWithLocal(localRegisterCmd);

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Post('public/local/signin')
  async localSignIn(@Body() localAuthenticateCmd: LocalAuthenticateCommand): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signInWithLocal(localAuthenticateCmd);
    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Get('public/facebook/oauth2url/sign-in')
  async getOauth2UrlForFacebookSignIn(): Promise<{ redirectUrl: string }> {
    return this.authFacebookService.getOauth2RedirectUrl(`${this.nestjsBffConfig.http.spaRootUrl}${this.nestjsBffConfig.social.facebook.callbackRelativeURL_signIn}`);
  }

  @Get('public/facebook/oauth2url/sign-up')
  async getOauth2UrlForFacebookSignUp(): Promise<{ redirectUrl: string }> {
    return this.authFacebookService.getOauth2RedirectUrl(`${this.nestjsBffConfig.http.spaRootUrl}${this.nestjsBffConfig.social.facebook.callbackRelativeURL_signUp}`);
  }

  @Post('public/facebook/signUp')
  async signUpWithFacebook(@Body('fbAuthorizationCode') fbAuthorizationCode: string): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signUpWithFacebook(fbAuthorizationCode, this.nestjsBffConfig.http.spaRootUrl);

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Post('public/facebook/signin')
  async signInWithFacebook(@Body('fbAuthorizationCode') fbAuthorizationCode: string): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signInWithFacebook(fbAuthorizationCode, this.nestjsBffConfig.http.spaRootUrl);

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Get('authorization')
  public async getAuthorization(@Req() req: BffRequest): Promise<{ accessPermissions?: AccessPermissionsContract }> {
    return { accessPermissions: req.accessPermissions };
  }

  // -- SYSTEM VERIFICATION ENDPOINTS --//
  @Get('public/verification')
  async verificationPublic(): Promise<string> {
    return 'hit';
  }

  @Get('verification/no-authorization-decorator')
  async verificationNoAuthorizationDecorator(): Promise<string> {
    return 'hit';
  }

  @Get('verification/role-protected-group-admin')
  @Authorization([new RoleAuthCheck(Roles.groupAdmin)])
  async verificationRoleProtectedGroupAdmin(): Promise<string> {
    return 'hit';
  }

  @Get(':organizationSlug/verification/organization-protected-member')
  @Authorization([new OrgRolesAuthCheck([OrganizationRoles.member])])
  async verificationOrganizationProtectedMember(): Promise<string> {
    return 'hit';
  }

  @Get(':organizationSlug/verification/organization-protected-admin')
  @Authorization([new OrgRolesAuthCheck([OrganizationRoles.admin])])
  async verificationOrganizationProtectedAdmin(): Promise<string> {
    return 'hit';
  }
}
