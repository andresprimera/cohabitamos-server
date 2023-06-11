import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import mongoose from 'mongoose';

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
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll() {
    return await this.accountRepository.find().catch((error) => {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    });
  }

  async findOne(_id: string) {
    const response = await this.accountRepository
      .findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No account was found for the provided _id');
    }

    return response;
  }

  async update(_id: string, updateAccountDto: UpdateAccountDto) {
    const response = await this.accountRepository
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) },
        updateAccountDto,
        {
          new: true,
        },
      )
      .catch((error) => {
        Logger.log(error.message);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No account was found for the provided _id');
    }

    return response;
  }

  async remove(_id: string) {
    return await this.accountRepository
      .deleteOne({ _id: new mongoose.Types.ObjectId(_id) })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }
}
