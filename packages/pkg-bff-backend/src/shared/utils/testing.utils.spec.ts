import { ObjectId } from 'mongodb';
import { TestingUtils } from './testing.utils';

const performanceTestIterations = 1000;

describe('GIVEN TestingUtils.objectIdsToStrings method', () => {
  it(`WHEN passing an Object with ObjectId types fields
    THEN execution time should be fast`, async () => {
    const o = {
      id: new ObjectId('5c36b1295ec9e3fbdc3d1062'),
      name: 'Foo',
      orgId: new ObjectId('5c36b1295ec9e3fbdc3d1054'),
    };

    const objectIdsToStringsFunc = () => {
      TestingUtils.objectIdsToStrings(o);
    };

    const processingTime = TestingUtils.measureExecutionTime(objectIdsToStringsFunc, performanceTestIterations);

    expect(processingTime).toBeLessThan(100);
  });
});
