import { Validator } from 'class-validator';
import { hash } from '../utils/hash.utils';
// import * as hash from 'object-hash';

export class CachingUtils {
  private static validator = new Validator();

  public static makeCacheKeyFromId(entityId: string): string {
    this.validator.isMongoId(entityId);
    return this.makeCacheKeyFromProperty(entityId, 'id');
  }

  public static makeCacheKeyFromProperty(
    propertyName: string,
    propertyValue: string,
  ): string {
    this.validator.isNotEmpty(propertyValue);
    this.validator.isNotEmpty(propertyName);
    return `CacheKey-${propertyName}-${propertyValue}`;
  }

  public static makeCacheKeyFromObject(object: object): string {
    return hash(JSON.stringify(object)).toString();
  }
}
