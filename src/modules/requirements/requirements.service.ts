import {
  BadRequestException,
  Injectable,
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
import { RequirementsLogService } from '../requirements-log/requirements-log.service';
import { ConvertToTaskDto } from './dto/convert-to-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { REQUIREMENT_STATE } from 'src/common/enums';

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
    private readonly requirementsLogsService: RequirementsLogService,
  ) {}

  async createRequest(createRequirementDto: CreateRequirementDto) {
    const {
      user: createUserDto,
      requirementType,
      unit: unitId,
      status,
      description,
    } = createRequirementDto || {};

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
      user = await this.usersService.create(createUserDto);
    }

    const requirement = await this.requirementRepository
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
        throw new BadRequestException(error.message);
      });

    await this.requirementsLogsService.create({
      requirement,
      message: `Requerimiento creado: ${description}`,
      records: [],
      updatedBy: user._id,
    });

    return requirement;
  }

  async createTask(
    createRequirementDto: CreateTaskDto,
    operator: UserEntity,
    requestCondominium: Types.ObjectId,
  ) {
    const {
      description,
      status = REQUIREMENT_STATE.OPEN,
      isUrgent,
      isImportant,
      estStartDate,
      estEndDate,
      actualStartDate = null,
      actualEndDate = null,
    } = createRequirementDto || {};

    const condominium: CondominiumEntity =
      await this.condominiumsService.findOne(requestCondominium);

    const requirement = await this.requirementRepository
      .create({
        requirementType: 'Tarea',
        description,
        condominium,
        status: status || 'Abierto',
        isTask: true,
        isUrgent,
        isImportant,
        estStartDate,
        estEndDate,
        actualStartDate,
        actualEndDate,
      })
      .catch((error) => {
        Logger.error('Error while creating the task', error);
        throw new BadRequestException(error.message);
      });

    await this.requirementsLogsService.create({
      requirement,
      message: `Tarea creada: ${description}`,
      records: [],
      updatedBy: operator._id,
    });

    return requirement;
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
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No requirement was found for this condominium',
      );
    }

    return { response, metadata: { totalDocs, limit, page } };
  }

  async findTasks(
    condominium: Types.ObjectId,
    requirementFiltersDto: RequirementFiltersDto,
  ) {
    const { limit = 10, page = 1 } = requirementFiltersDto.metadata || {};

    const query: any = {};

    query['condominium._id'] = condominium;
    query.isTask = true;

    // if (requirementFiltersDto?.status) {
    //   query['status'] = requirementFiltersDto.status;
    // }

    const totalDocs = await this.requirementRepository.find(query).count();

    const response = await this.requirementRepository
      .find(query)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ createdAt: -1 })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    const restructeredResponse = [];

    restructeredResponse.push(
      response.filter((item) => item.isImportant && item.isUrgent),
    );

    restructeredResponse.push(
      response.filter((item) => !item.isImportant && item.isUrgent),
    );

    restructeredResponse.push(
      response.filter((item) => item.isImportant && !item.isUrgent),
    );

    restructeredResponse.push(
      response.filter((item) => !item.isImportant && !item.isUrgent),
    );

    if (!response) {
      throw new NotFoundException(
        'No requirement was found for this condominium',
      );
    }

    return {
      restructeredResponse,
      metadata: {
        totalDocs,
        limit,
        page,
      },
    };
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.requirementRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No requirement was found for the provided _id',
      );
    }

    return response;
  }

  async getByUser(email: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('No user was found for the provided email');
    }

    return await this.requirementRepository
      .find({ 'user._id': user._id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async update(
    _id: Types.ObjectId,
    updateRequirementDto: UpdateRequirementDto,
    operator: UserEntity,
  ) {
    const { message, status, assignee } = updateRequirementDto;

    const requirement = await this.requirementRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.log(error.message);
        throw new BadRequestException(error.message);
      });

    if (!assignee && requirement?.status === status) {
      throw new BadRequestException(
        'El estatus a actualizar debe ser diferente al actual',
      );
    }

    if (!status && requirement?.assignee === assignee) {
      throw new BadRequestException(
        'El responsable a actualizar debe ser diferente al actual',
      );
    }

    let assigneeUser = null;

    if (assignee) {
      assigneeUser = await this.usersService.findOne(assignee);
    }

    await this.requirementsLogsService.create({
      requirement: requirement as RequirementEntity,
      message: `Nueva actualización de requerimiento${
        message ? ': ' + message : '.'
      }`,
      records: [
        ...(status
          ? [
              {
                field: 'status' as keyof RequirementEntity,
                newValue: updateRequirementDto.status,
              },
            ]
          : []),
        ...(assignee
          ? [
              {
                field: 'assignee' as keyof RequirementEntity,
                newValue: assigneeUser,
              },
            ]
          : []),
      ],
      updatedBy: operator._id,
    });

    const updateObject = {
      ...(status ? { status } : {}),
      ...(assignee ? { assigneeUser } : {}),
      ...updateRequirementDto,
    };

    const response = await this.requirementRepository
      .findOneAndUpdate({ _id }, updateObject, {
        new: true,
      })
      .catch((error) => {
        Logger.log(error.message);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException(
        'No requirement was found for the provided _id',
      );
    }

    return response;
  }

  async convertToTask(_id: Types.ObjectId, convertToTaskDto: ConvertToTaskDto) {
    const { isUrgent, isImportant, estStartDate, estEndDate } =
      convertToTaskDto || {};

    if (
      isUrgent === undefined ||
      isImportant === undefined ||
      estStartDate === undefined ||
      estEndDate === undefined
    ) {
      throw new BadRequestException(
        'IsUrgent, isImportant, estStartDate and estEndDate fields are mandatory.',
      );
    }

    const response = await this.requirementRepository
      .findOneAndUpdate(
        { _id },
        { isTask: true, ...convertToTaskDto },
        {
          new: true,
        },
      )
      .catch((error) => {
        Logger.log(error.message);
        throw new BadRequestException(error.message);
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
        throw new BadRequestException(error.message);
      });
  }

  async getMetrics({
    from,
    until,
    condominiumId,
  }: {
    from: Date;
    until: Date;
    condominiumId: Types.ObjectId;
  }) {
    const metrics = await this.requirementRepository.aggregate([
      {
        $match: {
          createdAt: {
            $gte: from,
            $lte: until,
          },
          'condominium._id': condominiumId,
        },
      },
      {
        $group: {
          _id: '$requirementType',
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          requirementsByType: {
            $push: {
              requirementType: '$_id',
              count: '$count',
            },
          },
          totalRequirements: { $sum: '$count' },
        },
      },
    ]);

    if (metrics.length !== 0) {
      metrics[0].requirementsByType = metrics[0].requirementsByType.map(
        (requirement: any, index: number) => ({
          ...requirement,
          index: index + 1,
        }),
      );
    }

    return metrics[0] || [];
  }
}
