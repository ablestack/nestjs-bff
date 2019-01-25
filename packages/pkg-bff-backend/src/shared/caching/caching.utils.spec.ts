import { TestingUtils } from '@nestjs-bff/global-utils-dev/lib/testing.utils';
import { FooEntity } from '../../domain/_foo/model/foo.entity';
import { getLogger } from '../logging/logging.shared.module';
import { CachingUtils } from './caching.utils';

const performanceTestIterations = 1000;

// @ts-ignore
const logger = getLogger();

describe('CachingUtils', () => {
  describe('makeCacheKeyFromId', () => {
    it('should return a string', async () => {
      const result = CachingUtils.makeCacheKeyFromId('507f191e810c19729de860ea');
      // logger.debug('makeCacheKeyFromId-result', result);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('makeCacheKeyFromProperty', () => {
    it('should return a string', async () => {
      const result = CachingUtils.makeCacheKeyFromProperty('foo', 'bar');
      // logger.debug('makeCacheKeyFromProperty-result', result);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('makeCacheKeyFromObject', () => {
    describe('with basic object', () => {
      it('should return a string', async () => {
        const result = CachingUtils.makeCacheKeyFromObject({
          foo: 'foo',
          bar: { baz: 'baz' },
        });
        // logger.debug('makeCacheKeyFromObject-result', result);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });

      it('should always return the same out from the same input - regardless of param ordering', async () => {
        const result1 = CachingUtils.makeCacheKeyFromObject({
          foo: 'foo',
          bar: { baz: 'baz' },
        });

        const result2 = CachingUtils.makeCacheKeyFromObject({
          bar: { baz: 'baz' },
          foo: 'foo',
        });

        // logger.debug('makeCacheKeyFromObject-result', { result1, result2 });
        expect(result1).toEqual(result2);
      });

      it('should return different results for different input', async () => {
        const result1 = CachingUtils.makeCacheKeyFromObject({
          foo: 'foo',
          bar: { baz: 'baz' },
        });

        const result2 = CachingUtils.makeCacheKeyFromObject({
          foo: 'foo',
          bar: { baz: 'bag' },
        });

        // logger.debug('makeCacheKeyFromObject-result', { result1, result2 });
        expect(result1).not.toEqual(result2);
      });
    });
  });

  describe('with full query condition', () => {
    it('should return a string', async () => {
      const qc = new FooEntity();
      qc.id = '507f191e810c19729de860ea';
      qc.orgId = '607f191e810c19729de860ea';
      qc.userId = '707f191e810c19729de860ea';
      qc.alwaysDefinedSlug = 'foo';

      const result = CachingUtils.makeCacheKeyFromObject(qc);
      // logger.debug('makeCacheKeyFromObject-result', result);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('with partial query condition', () => {
    it('should return a string', async () => {
      const qc = new FooEntity();
      qc.orgId = '607f191e810c19729de860ea';
      qc.alwaysDefinedSlug = 'foo';

      const result = CachingUtils.makeCacheKeyFromObject(qc);
      // logger.debug('makeCacheKeyFromObject-result', result);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('makeCacheKeyFromObject - performance', () => {
    it('should be fast', async () => {
      const makeCachKeyFunc = () => {
        CachingUtils.makeCacheKeyFromObject({
          foo: 'foo',
          bar: { baz: 'baz' },
        });
      };

      const processingTime = TestingUtils.measureExecutionTime(makeCachKeyFunc, performanceTestIterations);
      // logger.debug(`makeCachKeyFunc ${performanceTestIterations} iterations`, processingTime);

      expect(processingTime).toBeLessThan(1000);
    });
  });
});
