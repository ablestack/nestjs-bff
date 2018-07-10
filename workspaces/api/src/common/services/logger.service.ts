export abstract class LoggerService {
  public abstract log(message: string, ...logObjects: any[]): void;
  public abstract info(message: string, ...logObjects: any[]): void;
  public abstract error(message: string, ...logObjects: any[]): void;
  public abstract warn(message: string, ...logObjects: any[]): void;
  public abstract debug(message: string, ...logObjects: any[]): void;
  public abstract trace(message: string, ...logObjects: any[]): void;
}
