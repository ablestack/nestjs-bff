import { UserDto } from '../dto/user-dto';

export interface JwtPayload {
  user: UserDto;
}
