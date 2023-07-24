import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequirementTypeDto } from './dto/create-requirement-type.dto';
import { UpdateRequirementTypeDto } from './dto/update-requirement-type.dto';
import { RequirementTypeEntity } from 'src/entities/requirement-type.entity';
import { ReturnModelType, types } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';

@Injectable()
export class RequirementTypesService {
  constructor(
    @InjectModel(RequirementTypeEntity)
    private readonly requirementTypeRepository: ReturnModelType<
      typeof RequirementTypeEntity
    >,
  ) {}

  async create(createRequirementTypeDto: CreateRequirementTypeDto) {
    return await this.requirementTypeRepository
      .create(createRequirementTypeDto)
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findRequirementTypesByCondominium(condominium: Types.ObjectId) {
    //TODO: pagination
    return await this.requirementTypeRepository
      .find({ condominium })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.requirementTypeRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No account was found for the provided _id');
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.requirementTypeRepository
      .deleteOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }
}
