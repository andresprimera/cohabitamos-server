import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequirementDto } from './dto/create-requirement.dto';
import { UpdateRequirementDto } from './dto/update-requirement.dto';
import { InjectModel } from 'nestjs-typegoose';
import { RequirementEntity } from 'src/entities/requirement.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { UsersService } from '../users/users.service';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { UnitsService } from '../units/units.service';
import { UnitEntity } from 'src/entities/unit.entity';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class RequirementsService {
  constructor(
    @InjectModel(RequirementEntity)
    private readonly requirementRepository: ReturnModelType<
      typeof RequirementEntity
    >,
    private readonly usersService: UsersService,
    private readonly unitsService: UnitsService,
    private readonly condominiumsService: CondominiumsService,
  ) {}

  //TODO: modify dto to bring all the info the requirement needs
  async create(createRequirementDto: CreateRequirementDto) {
    const {
      user: createUserDto,
      requirementType,
      unit: unitId,
      status,
      description,
    } = createRequirementDto;

    if (!createRequirementDto?.user) {
      throw new BadRequestException('Required field user not provided.');
    }

    const unit: UnitEntity = await this.unitsService.findOne(unitId);

    const condominium: CondominiumEntity =
      await this.condominiumsService.findOne(String(unit.condominium));

    const { _id: userId } = createUserDto;

    let user: UserEntity;
    if (userId) {
      user = await this.usersService.findOne(userId);
    } else {
      createUserDto.account = condominium.account;
      user = await this.usersService.create(createUserDto);
    }

    return await this.requirementRepository
      .create({
        requirementType,
        description,
        unit,
        user,
        condominium,
        status: status || 'Abierto',
      })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }

  //TODO: retrieve every requirement by several filters: condominium, date, unit, type
  // async findAll() {
  //   return `This action returns all requirements`;
  // }

  async findOne(_id: string) {
    const response = await this.requirementRepository
      .findOne({ _id: new mongoose.Types.ObjectId(_id) })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No requirement was found for the provided _id',
      );
    }

    return response;
  }

  async update(_id: string, updateRequirementDto: UpdateRequirementDto) {
    const response = await this.requirementRepository
      .findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) },
        { status: updateRequirementDto.status },
        {
          new: true,
        },
      )
      .catch((error) => {
        Logger.log(error.message);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No requirement was found for the provided _id',
      );
    }

    return response;
  }

  async remove(_id: string) {
    return await this.requirementRepository
      .deleteOne({ _id: new mongoose.Types.ObjectId(_id) })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }
}
