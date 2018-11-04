export interface IJwtPayload {
  readonly iat: number;
  readonly exp: number;
  readonly aud: string;
  readonly iss: string;
  readonly sub: string;
  readonly roles: string[];
}
