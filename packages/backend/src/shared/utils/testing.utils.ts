export class TestingUtils {
  public static MeasureExecutionTime = (
    func: () => any,
    iterations: number,
  ): number => {
    const start = new Date();
    for (let i = 0; i < iterations; i++) {
      func();
    }
    const finish = new Date();
    return finish.getTime() - start.getTime();
  }
}
