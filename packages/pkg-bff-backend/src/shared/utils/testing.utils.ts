import { ObjectId } from 'mongodb';

export class TestingUtils {
  public static measureExecutionTime = (func: () => any, iterations: number): number => {
    const start = new Date();
    for (let i = 0; i < iterations; i++) {
      func();
    }
    const finish = new Date();
    return finish.getTime() - start.getTime();
  }

  public static generateMongoObjectIdString() {
    return new ObjectId().toHexString();
  }

  public static objectIdsToStrings(obj: object): object {
    return JSON.parse(JSON.stringify(obj));
  }
}
