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
    // tslint:disable-next-line:no-bitwise
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    const objectId =
      timestamp +
      'xxxxxxxxxxxxxxxx'
        .replace(/[x]/g, () => {
          // tslint:disable-next-line:no-bitwise
          return ((Math.random() * 16) | 0).toString(16);
        })
        .toLowerCase();

    return objectId;
  }

  public static objectIdsToStrings(obj: object): object {
    return JSON.parse(JSON.stringify(obj));
  }
}
