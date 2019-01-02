import { IsMongoId } from 'class-validator';

export class BaseQueryConditions {
  @IsMongoId()
  public _id: string = '';
}
