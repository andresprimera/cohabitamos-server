import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsersByUnitDto } from './dto/create-users-by-unit.dto';
import { UpdateUsersByUnitDto } from './dto/update-users-by-unit.dto';
import { UsersByUnitEntity } from 'src/entities/users-by-unit.entity';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class UsersByUnitService {
  constructor(
    @InjectModel(UsersByUnitEntity)
    private readonly usersByUnitRepository: ReturnModelType<
      typeof UsersByUnitEntity
    >,
  ) {}

  async create(createUsersByUnitDto: CreateUsersByUnitDto) {
    return await this.usersByUnitRepository
      .create(createUsersByUnitDto)
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }

  //TODO: create this query for just this unit
  // async findAll() {
  //   //TODO: Pagination
  //   return await this.usersByUnitRepository.find().catch((error) => {
  //     Logger.error(error);
  //     throw new InternalServerErrorException(error.message);
  //   });
  // }

  async findOne(_id: Types.ObjectId) {
    //TODO: get units for this condominium
    const response = await this.usersByUnitRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided _id');
    }

    return response;
  }

  async update(
    _id: Types.ObjectId,
    updateUsersByUnitDto: UpdateUsersByUnitDto,
  ) {
    const response = await this.usersByUnitRepository
      .findOneAndUpdate({ _id }, updateUsersByUnitDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided _id');
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.usersByUnitRepository
      .deleteOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }
}
