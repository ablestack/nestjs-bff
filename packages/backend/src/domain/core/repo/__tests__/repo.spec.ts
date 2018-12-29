import { Test } from '@nestjs/testing';
import { DomainCoreModule } from '../../core.module';
import { DomainFooModule } from '../__mocks__/foo/foo.module';
import { FooRepo } from '../__mocks__/foo/repo/foo.repo';

describe('BaseRepo', () => {
  let fooRepo: FooRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [DomainCoreModule, DomainFooModule],
    }).compile();

    fooRepo = await module.get<FooRepo>(FooRepo);
  });

  describe('findOne', () => {
    it('should return an array of cats', async () => {
      const aFoo = { _id: '123', name: 'foomanchu', slug: 'fooman' };

      console.log({ fooRepo });

      jest.spyOn(fooRepo, '_mongooseFindOne').mockImplementation(conditions => {
        return aFoo;
      });

      const result = fooRepo.findOne({ _id: '123' });
      expect(result).toBe(aFoo);
    });
  });

  describe('validateQuery', () => {});

  describe('validateEntity', () => {});
});
