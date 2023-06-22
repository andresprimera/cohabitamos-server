import { Injectable, BadRequestException, Logger } from '@nestjs/common';
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
    return await this.optionsRepository
      .create(createOptionDto)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findAll() {
    return await this.optionsRepository.find().catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }
}
