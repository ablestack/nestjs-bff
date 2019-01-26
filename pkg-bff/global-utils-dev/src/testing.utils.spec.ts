import { TestingUtils } from './testing.utils';
import 'jest';

const performanceTestIterations = 1000;

describe('GIVEN TestingUtils.objectIdsToStrings method', () => {
  it(`WHEN passing an Object with ObjectId types fields
    THEN execution time should be fast`, async () => {
    const o = {
      id: TestingUtils.generateMongoObjectIdString(),
      name: 'Foo',
      orgId: TestingUtils.generateMongoObjectIdString(),
    };

    const objectIdsToStringsFunc = () => {
      TestingUtils.objectIdsToStrings(o);
    };

    const processingTime = TestingUtils.measureExecutionTime(objectIdsToStringsFunc, performanceTestIterations);

    expect(processingTime).toBeLessThan(100);
  });
});
