import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  public create(cat: Cat) {
    this.cats.push(cat);
  }

  public findAll(): Cat[] {
    return this.cats;
  }
}
