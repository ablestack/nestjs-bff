import { Controller, Get, Post, Body, Headers, UseGuards, UseInterceptors, Param } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from '../common/services/logger.service';

@Controller('cats')
@UseInterceptors(TransformInterceptor)
export class CatsController {
  constructor(private readonly catsService: CatsService, private loggerService: LoggerService) {}

  @Post()
  @Roles('staff')
  public async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  public async findAll(@Headers() headers: string[]): Promise<Cat[]> {
    this.loggerService.debug(`${__filename} - findAll - headers`, headers);
    return this.catsService.findAll();
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('staff')
  public async findProtected(@Headers() headers: string[]): Promise<Cat[]> {
    this.loggerService.debug(`${__filename} - findAll - headers`, headers);
    return this.catsService.findAll();
  }

  @Get(':id')
  public findOne(
    @Param('id', new ParseIntPipe())
    id,
  ) {
    // logic
  }
}
