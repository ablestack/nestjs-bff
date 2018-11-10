import { LocalAuthenticateCommand } from '@nestjs-bff/universal/commands/auth/local-authenticate.command';
import { LocalRegisterCommand } from '@nestjs-bff/universal/commands/auth/local-register.command';
import {
  OrganizationRoles,
  Roles,
} from '@nestjs-bff/universal/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { IAuthenticationToken } from '@nestjs-bff/universal/interfaces/authentication-token.interface';
import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { UserAuthApplicationService } from '../../../application/user-auth/user-auth.application.service';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { FacebookAuthenticationDomainService } from '../../../domain/authentication/social/facebook-authentication.domain.service';
import { CheckOrganizationRoles } from '../../../domain/authorization/authorization-tests/check-organization-roles.authtest';
import { CheckRole } from '../../../domain/authorization/authorization-tests/check-roles.authorizationtest';
import { AppSysProviderTokens } from '../../../shared/app/app.shared.constants';
import { Authorization } from '../core/decorators/authorization.http.decorator';
import { JwtTokenHttpService } from '../core/jwt/jwt-token.http.service';

@Controller('api/auth')
export class AuthHttpController {
  constructor(
    @Inject(AppSysProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly authFacebookService: FacebookAuthenticationDomainService,
    private readonly userAuthenticationService: UserAuthApplicationService,
    private readonly jwtTokenService: JwtTokenHttpService,
  ) {}

  @Post('public/local/signup')
  async localSignUp(
    @Body() localRegisterCmd: LocalRegisterCommand,
  ): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signUpWithLocal(
      localRegisterCmd,
    );

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Post('public/local/signin')
  async localSignIn(
    @Body() localAuthenticateCmd: LocalAuthenticateCommand,
  ): Promise<IAuthenticationToken> {
    console.log({localAuthenticateCmd});
    const authenticationEntity = await this.userAuthenticationService.signInWithLocal(
      localAuthenticateCmd,
    );
    console.log({authenticationEntity});
    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Get('public/facebook/oauth2url/sign-in')
  async getOauth2UrlForFacebookSignIn(): Promise<{ redirectUrl: string }> {
    return this.authFacebookService.getOauth2RedirectUrl(
      `${this.nestjsBffConfig.http.spaRootUrl}${
        this.nestjsBffConfig.social.facebook.callbackRelativeURL_signIn
      }`,
    );
  }

  @Get('public/facebook/oauth2url/sign-up')
  async getOauth2UrlForFacebookSignUp(): Promise<{ redirectUrl: string }> {
    return this.authFacebookService.getOauth2RedirectUrl(
      `${this.nestjsBffConfig.http.spaRootUrl}${
        this.nestjsBffConfig.social.facebook.callbackRelativeURL_signUp
      }`,
    );
  }

  @Post('public/facebook/signUp')
  async signUpWithFacebook(
    @Body('fbAuthorizationCode') fbAuthorizationCode: string,
  ): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signUpWithFacebook(
      fbAuthorizationCode,
      this.nestjsBffConfig.http.spaRootUrl,
    );

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Post('public/facebook/signin')
  async signInWithFacebook(
    @Body('fbAuthorizationCode') fbAuthorizationCode: string,
  ): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signInWithFacebook(
      fbAuthorizationCode,
      this.nestjsBffConfig.http.spaRootUrl,
    );

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Get('authorization')
  public async getAuthorization(
    @Req() req,
  ): Promise<{ authorization: AuthorizationEntity }> {
    return { authorization: req.authorization };
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
  @Authorization([new CheckRole(Roles.groupAdmin)])
  async verificationRoleProtectedGroupAdmin(): Promise<string> {
    return 'hit';
  }

  @Get(':organizationSlug/verification/organization-protected-member')
  @Authorization([new CheckOrganizationRoles([OrganizationRoles.member])])
  async verificationOrganizationProtectedMember(): Promise<string> {
    return 'hit';
  }

  @Get(':organizationSlug/verification/organization-protected-admin')
  @Authorization([new CheckOrganizationRoles([OrganizationRoles.admin])])
  async verificationOrganizationProtectedAdmin(): Promise<string> {
    return 'hit';
  }
}
