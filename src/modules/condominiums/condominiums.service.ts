import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import mongoose, { Types } from 'mongoose';
import { UnitsService } from '../units/units.service';

@Injectable()
export class CondominiumsService {
  constructor(
    @InjectModel(CondominiumEntity)
    private readonly condominiumRepository: ReturnModelType<
      typeof CondominiumEntity
    >,

    private readonly unitsService: UnitsService,
  ) {}

  async create(createCondominiumDto: CreateCondominiumDto) {
    return await this.condominiumRepository
      .create(createCondominiumDto)
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll() {
    //TODO: Pagination
    return await this.condominiumRepository.find().catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.condominiumRepository
      .aggregate([
        { $match: { _id } }, // This will ensures that there is only 1 object in the response array
        {
          $lookup: {
            from: 'units',
            localField: '_id',
            foreignField: 'condominium',
            as: 'units',
          },
        },
      ])
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (response && response.length === 0) {
      throw new NotFoundException(
        'No condominium was found for the provided _id',
      );
    }

    return response[0];
  }

  async update(
    _id: Types.ObjectId,
    updateCondominiumDto: UpdateCondominiumDto,
  ) {
    const response = await this.condominiumRepository
      .findOneAndUpdate({ _id }, updateCondominiumDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No condominium was found for the provided _id',
      );
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    const removedUnits = await this.unitsService
      .deleteMany(_id)
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    const removedCondominium = await this.condominiumRepository
      .deleteOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    return { removedUnits, removedCondominium };
  }
}
