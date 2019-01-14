import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { INestjsBffConfig } from '../../../../config/nestjs-bff.config';
import { OrganizationRepo } from '../../../../domain/organization/repo/organization.repo';
import { AppSharedProviderTokens } from '../../../../shared/app/app.shared.constants';
import { AuthCheckContract } from '../../../../shared/authchecks/authcheck.contract';
import { CacheStore } from '../../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BadGatewayHttpError } from '../exceptions/server.exception';
import { getReqMetadataLite } from '../utils/core.utils';

/**
 *
 *
 * @summary
 *  Checks authorization against a configured authcheck
 *  Defaults false: no authcheck found means no authorization
 *  Looks for authcheck from handler - first on handler method, then on controller
 *
 * @export
 * @class ResourceGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly organizationRepo: OrganizationRepo,
    @Inject(CachingProviderTokens.Services.CacheStore) private readonly cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly logger: LoggerSharedService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<any>();
      if (!req) throw new BadGatewayHttpError('request can not be null');

      this.logger.trace('AuthorizationGuard.canActivate', {
        'req.originalUrl': req.originalUrl,
      });

      // test to see if public route
      if (this.nestjsBffConfig.http.publicRouteRegex.test(req.originalUrl)) {
        this.logger.debug('Public Route', req.originalUrl);
        return true;
      }

      // get authorization from request
      const accessPermissions = req.accessPermissions as AccessPermissionsContract;
      if (!accessPermissions) {
        this.logger.warn('Route not public, but no authorization found. ', {
          request: getReqMetadataLite(req),
        });
        return false;
      }

      // debug logging
      this.logger.debug('AuthorizationGuard', {
        'req.params': req.params,
        'req.route': req.route,
        accessPermissions,
      });

      // get key date for auth tests
      const orgId: string | undefined = await this.getOrgIdFromSlug(req.params['organizationSlug']);
      const userId: string | undefined = req.params['userId'];
      const authchecks = await this.getauthchecksFromCache(context);

      // Default false. No authcheck configured, not authorization
      if (!authchecks || authchecks.length === 0) {
        this.logger.warn('Request not authorized', {
          request: getReqMetadataLite(req),
          authorization: accessPermissions,
        });
        return false;
      }

      // run tests
      for (const authcheck of authchecks) {
        const authCheckData = {
          origin: 'AuthorizationGuard',
          accessPermissions,
          targetResource: {
            orgId,
            userId,
          },
        };
        if (!(await authcheck.isAuthorized(authCheckData))) {
          this.logger.warn(`authcheck failed for ${authcheck.constructor.name}: ${JSON.stringify({ authcheck, authCheckData }, null, 2)}`);
          return false;
        }
      }

      // if we made it here we passed all the tests.  return true
      this.logger.debug(`authcheck passed`, {
        authorization: accessPermissions,
        orgId,
      });
      return true;
    } catch (error) {
      this.logger.error('Error in AuthorizationGuard', error);
      return false;
    }
  }

  /**
   *
   * @param organizationSlug
   */
  private async getOrgIdFromSlug(organizationSlug: string): Promise<string | undefined> {
    if (!organizationSlug) {
      this.logger.debug('organizationSlug not found');
      return undefined;
    }

    this.logger.debug('organizationSlug found', organizationSlug);

    const organization = await this.organizationRepo.findOne({ slug: organizationSlug }, { skipAuthorization: true });
    if (!organization) {
      this.logger.debug('orgId not found for slug', organizationSlug);
      return undefined;
    }

    this.logger.debug('orgId found for slug', {
      organizationSlug,
      orgId: organization._id,
    });
    return organization._id;
  }

  private async getauthchecksFromCache(context: ExecutionContext): Promise<Array<AuthCheckContract<any, any>>> {
    const authcheckCacheKey = `AuthorizationGuard-authcheck?class=${context.getClass()}&handler=${context.getHandler()})`;

    return this.cacheStore.wrap<AuthCheckContract<any, any> | Array<AuthCheckContract<any, any>> | null>(
      authcheckCacheKey,
      () => this.getauthcheck(context),
      // This configuration does not change dynamically.  Cache for a week
      { ttl: 60 * 60 * 24 * 7 },
    );
  }

  private async getauthcheck(context: ExecutionContext): Promise<Array<AuthCheckContract<any, any>>> {
    let authchecks = this.reflector.get<Array<AuthCheckContract<any, any>>>('authorization', context.getHandler());
    if (!authchecks) {
      authchecks = this.reflector.get<Array<AuthCheckContract<any, any>>>('authorization', context.getClass());
    }
    return authchecks;
  }
}
