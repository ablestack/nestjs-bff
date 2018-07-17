export interface User {
  readonly id: number;
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly roles: string[];
  readonly password: string;
}
