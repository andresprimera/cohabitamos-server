import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { UserEntity } from '../../entities/user.entity';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity)
    private readonly userRepository: ReturnModelType<typeof UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto).catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findAll() {
    //TODO: Pagination
    return await this.userRepository.find().catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.userRepository
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

  async findByEmail(email: string) {
    const response = await this.userRepository
      .aggregate([
        {
          $match: { email },
        },
        {
          $lookup: {
            from: 'users_by_unit',
            localField: '_id',
            foreignField: 'user',
            as: 'units',
            pipeline: [
              {
                $lookup: {
                  from: 'units',
                  localField: 'unit',
                  foreignField: '_id',
                  as: 'unit',
                },
              },
              {
                $unwind: '$unit',
              },
              {
                $project: {
                  _id: '$unit._id',
                  number: '$unit.number',
                  type: '$unit.type',
                  block: '$unit.block',
                  condominium: '$unit.condominium',
                  condition: 1,
                },
              },
            ],
          },
        },
      ])
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    console.log({ response });

    if (response.length === 0) {
      throw new NotFoundException('No user was found for the provided email');
    }

    return response[0];
  }

  async update(_id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    const response = await this.userRepository
      .findOneAndUpdate({ _id }, updateUserDto, {
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
    return await this.userRepository.deleteOne({ _id }).catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }
}
