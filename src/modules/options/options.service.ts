import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectModel } from 'nestjs-typegoose';
import { OptionsEntity } from 'src/entities/options.entity';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class OptionsService {
  constructor(
    @InjectModel(OptionsEntity)
    private readonly optionsRepository: ReturnModelType<typeof OptionsEntity>,
  ) {}

  async create(createOptionDto: CreateOptionDto) {
    console.log('This runs');
    return await this.optionsRepository
      .create(createOptionDto)
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll() {
    return await this.optionsRepository.find().catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
