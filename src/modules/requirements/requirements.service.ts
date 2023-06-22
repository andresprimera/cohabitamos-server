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
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { UnitsService } from '../units/units.service';
import { UnitEntity } from 'src/entities/unit.entity';
import { CondominiumEntity } from 'src/entities/condominium.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UsersByUnitService } from '../users-by-unit/users-by-unit.service';
import { RequirementFiltersDto } from './dto/requirement-filter.dto';

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
    private readonly usersByUnitsService: UsersByUnitService,
  ) {}

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

    const unit: UnitEntity = await this.unitsService.findOne(
      new Types.ObjectId(unitId),
    );

    const condominium: CondominiumEntity =
      await this.condominiumsService.findOne(
        new Types.ObjectId(String(unit.condominium)),
      );

    const { _id: userId } = createUserDto;

    let user: UserEntity;
    if (userId) {
      user = await this.usersService.findOne(new Types.ObjectId(userId));

      const userByUnit = await this.usersByUnitsService.findByUserId(user._id);

      if (!userByUnit) {
        await this.usersByUnitsService.create({
          unit: unit._id,
          user: user._id,
          condition: createUserDto.condition,
        });
      }
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
        Logger.error('This is the error is running =>', error);
        throw new InternalServerErrorException(error.message);
      });
  }

  async findAll(
    condominium: Types.ObjectId,
    requirementFiltersDto: RequirementFiltersDto,
  ) {
    const { limit = 10, page = 1 } = requirementFiltersDto.metadata || {};

    const query: any = {};

    query['condominium._id'] = condominium;

    if (requirementFiltersDto?.status) {
      query['status'] = requirementFiltersDto.status;
    }

    const totalDocs = await this.requirementRepository.find(query).count();

    const response = await this.requirementRepository
      .find(query)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ createdAt: -1 })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No requirement was found for this condominium',
      );
    }

    return { response, metadata: { totalDocs, limit, page } };
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.requirementRepository
      .findOne({ _id })
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

  async update(
    _id: Types.ObjectId,
    updateRequirementDto: UpdateRequirementDto,
  ) {
    const response = await this.requirementRepository
      .findOneAndUpdate(
        { _id },
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

  async remove(_id: Types.ObjectId) {
    return await this.requirementRepository
      .deleteOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });
  }
}
