import { FooQueryConditions } from '../../../domain/core/repo/__mocks__/foo/repo/foo.query-conditions';
import { getLogger } from '../../logging/logging.shared.module';
import { CachingUtils } from '../caching.utils';
const logger = getLogger();

describe('CachingUtils', () => {
  describe('makeCacheKeyFromId', () => {
    it('should return a string', async () => {
      const result = CachingUtils.makeCacheKeyFromId(
        '507f191e810c19729de860ea',
      );
      logger.debug('makeCacheKeyFromId-result', result);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('makeCacheKeyFromProperty', () => {
    it('should return a string', async () => {
      const result = CachingUtils.makeCacheKeyFromProperty('foo', 'bar');
      logger.debug('makeCacheKeyFromProperty-result', result);
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
        logger.debug('makeCacheKeyFromObject-result', result);
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

        logger.debug('makeCacheKeyFromObject-result', { result1, result2 });
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

        logger.debug('makeCacheKeyFromObject-result', { result1, result2 });
        expect(result1).not.toEqual(result2);
      });
    });
  });

  describe('with full query condition', () => {
    it('should return a string', async () => {
      const qc = new FooQueryConditions();
      qc._id = '507f191e810c19729de860ea';
      qc.orgId = '607f191e810c19729de860ea';
      qc.userId = '707f191e810c19729de860ea';
      qc.slug = 'foo';

      const result = CachingUtils.makeCacheKeyFromObject(qc);
      logger.debug('makeCacheKeyFromObject-result', result);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('with partial query condition', () => {
    it('should return a string', async () => {
      const qc = new FooQueryConditions();
      qc.orgId = '607f191e810c19729de860ea';
      qc.slug = 'foo';

      const result = CachingUtils.makeCacheKeyFromObject(qc);
      logger.debug('makeCacheKeyFromObject-result', result);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
