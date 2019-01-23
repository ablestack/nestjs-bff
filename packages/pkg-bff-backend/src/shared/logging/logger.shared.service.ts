export abstract class LoggerSharedService {
  public abstract log(msg: string, ...logObjects: any[]): void;

  public abstract info(msg: string, ...logObjects: any[]): void;

  public abstract error(msg: string, ...logObjects: any[]): void;

  public abstract warn(msg: string, ...logObjects: any[]): void;

  public abstract debug(msg: string, ...logObjects: any[]): void;

  public abstract trace(msg: string, ...logObjects: any[]): void;
}
