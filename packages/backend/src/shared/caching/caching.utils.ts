import { Validator } from 'class-validator';
import * as hash from 'object-hash';

export class CachingUtils {
  private static validator = new Validator();

  public static makeCacheKeyFromId(entityId: string): string {
    this.validator.isMongoId(entityId);
    return this.makeCacheKeyFromProperty(entityId, 'id');
  }

  protected static makeCacheKeyFromProperty(propertyValue: string, propertyName: string): string {
    this.validator.isNotEmpty(propertyValue);
    this.validator.isNotEmpty(propertyName);
    return `CacheKey-${propertyName}-${propertyValue}`;
  }

  protected static makeCacheKeyFromObject(object: object): string {
    return hash(object);
  }
}
