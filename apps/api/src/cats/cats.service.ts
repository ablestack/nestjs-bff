import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(@Inject('CatModelToken') private readonly catModel: Model<Cat>) {}

  public async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return await createdCat.save();
  }

  public async findAll(): Promise<Cat[]> {
    return await this.catModel.find().exec();
  }

  public async findOne(id: number): Promise<Cat> {
    return await this.catModel.findById(id);
  }
}
