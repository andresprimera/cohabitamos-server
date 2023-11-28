import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitEntity } from 'src/entities/unit.entity';
import { getModelForClass, Ref, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(UnitEntity)
    private readonly unitRepository: ReturnModelType<typeof UnitEntity>,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    return await this.unitRepository.create(createUnitDto).catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }

  async createMany(createManyUnitsDto: CreateUnitDto[]) {
    const unitModel = getModelForClass(UnitEntity);

    const units = createManyUnitsDto.map((unit) => {
      const newUnit = new unitModel();
      newUnit.number = unit.number;
      newUnit.type = unit.type;
      newUnit.block = unit.block;
      newUnit.condominium = unit.condominium;

      return newUnit;
    });

    return await this.unitRepository.bulkSave(units).catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }

  async findUnitsByCondominium(condominium: Types.ObjectId) {
    const response = await this.unitRepository
      .find({ condominium })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No units was found for this condominium');
    }

    return response;
  }

  async findMany(units: any[]) {
    const response = await this.unitRepository
      .find({ $or: units })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No units was found for this criteria');
    }

    return response;
  }

  async findOne(_id: Ref<UnitEntity>) {
    const response = await this.unitRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No unit was found for the provided _id');
    }

    return response;
  }

  async update(_id: Types.ObjectId, updateUnitDto: UpdateUnitDto) {
    const response = await this.unitRepository
      .findOneAndUpdate({ _id }, updateUnitDto, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No unit was found for the provided _id');
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.unitRepository.deleteOne({ _id }).catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }

  async deleteMany(condominium: Types.ObjectId) {
    return await this.unitRepository
      .deleteMany({ condominium })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }
}
