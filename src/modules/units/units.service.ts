import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitEntity } from 'src/entities/unit.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import mongoose from 'mongoose';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(UnitEntity)
    private readonly unitRepository: ReturnModelType<typeof UnitEntity>,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    return await this.unitRepository.create(createUnitDto).catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findOne(_id: string) {
    const response = await this.unitRepository
      .findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No unit was found for the provided _id');
    }

    return response;
  }

  async update(_id: string, updateUnitDto: UpdateUnitDto) {
    const response = await this.unitRepository
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) },
        updateUnitDto,
        {
          new: true,
        },
      )
      .catch((error) => {
        Logger.log(error.message);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No unit was found for the provided _id');
    }

    return response;
  }

  async remove(_id: string) {
    const response = await this.unitRepository
      .deleteOne({ _id: new mongoose.Types.ObjectId(_id) })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    return response;
  }
}
