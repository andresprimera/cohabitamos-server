import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(AccountEntity)
    private readonly accountRepository: ReturnModelType<typeof AccountEntity>,
  ) {}

  async create(dtoWithFormatedId: CreateAccountDto) {
    return await this.accountRepository
      .create(dtoWithFormatedId)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findAll() {
    return await this.accountRepository.find().catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }

  async findOne(owner: Types.ObjectId) {
    const response = await this.accountRepository
      .findOne({ owner })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No account was found for the provided owner id',
      );
    }

    return response;
  }

  async update(_id: Types.ObjectId, updateAccountDto: UpdateAccountDto) {
    const response = await this.accountRepository
      .findOneAndUpdate({ _id }, updateAccountDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No account was found for the provided _id');
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.accountRepository.deleteOne({ _id }).catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }
}
