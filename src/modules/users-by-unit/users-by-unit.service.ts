import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUsersByUnitDto } from './dto/create-users-by-unit.dto';
import { UpdateUsersByUnitDto } from './dto/update-users-by-unit.dto';
import { UsersByUnitEntity } from 'src/entities/users-by-unit.entity';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UnitsService } from '../units/units.service';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from 'src/providers/notifications';
import { IUnitAuthRequestPayload } from 'src/providers/notifications/types';
import { ETemplates } from 'src/providers/notifications/enums';

@Injectable()
export class UsersByUnitService {
  constructor(
    @InjectModel(UsersByUnitEntity)
    private readonly usersByUnitRepository: ReturnModelType<
      typeof UsersByUnitEntity
    >,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly unitsService: UnitsService,
    private readonly condominiumService: CondominiumsService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createUsersByUnitDto: CreateUsersByUnitDto) {
    const unit = await this.unitsService.findOne(createUsersByUnitDto.unit);

    return await this.usersByUnitRepository
      .create({ ...createUsersByUnitDto, condominium: unit.condominium })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      })
      .finally(async () => {
        const condominium = await this.condominiumService.findOne(
          unit.condominium as Types.ObjectId,
        );
        const user = await this.usersService.findOne(createUsersByUnitDto.user);

        this.notificationService.sendEmail<IUnitAuthRequestPayload>({
          action: ETemplates.UNIT_AUTH_REQUEST_CREATED,
          to: user?.email || '',
          payload: {
            condition: createUsersByUnitDto.condition,
            condominiumName: condominium?.name || '',
            userEmail: user?.email || '',
            unitNumber: unit?.number || '',
            unitType: unit?.type || '',
            unitBlock: unit?.block || '',
            name: `${user?.firstName} ${user?.lastName}`,
          },
        });
      });
  }

  async findByUserId(_id: Types.ObjectId) {
    return await this.usersByUnitRepository
      .findOne({ user: _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async find(_id: Types.ObjectId) {
    const response = await this.usersByUnitRepository
      .aggregate([
        {
          $match: { unit: _id },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
      ])
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided _id ');
    }

    return response;
  }

  async findAuthPending(requestCondominium: Types.ObjectId) {
    const condominium = await this.condominiumService.findOne(
      requestCondominium,
    );

    const pipeline = [
      {
        $match: {
          condominium: condominium._id,
          status: 'Pendiente',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $lookup: {
          from: 'units',
          localField: 'unit',
          foreignField: '_id',
          as: 'unit',
        },
      },
      {
        $unwind: {
          path: '$unit',
        },
      },
    ];

    return await this.usersByUnitRepository.aggregate(pipeline);
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
        throw new BadRequestException(error.message);
      })
      .finally(async () => {
        const userByUnit = await this.usersByUnitRepository
          .find({ _id })
          .toJSON();

        const condominium = await this.condominiumService.findOne(
          userByUnit?.condominium as Types.ObjectId,
        );
        // const user = await this.usersService.findOne(createUsersByUnitDto.user);

        // this.notificationService.sendEmail<IUnitAuthRequestPayload>({
        //   action: ETemplates.UNIT_AUTH_REQUEST_CREATED,
        //   to: user?.email || '',
        //   payload: {
        //     condition: createUsersByUnitDto.condition,
        //     condominiumName: condominium?.name || '',
        //     userEmail: user?.email || '',
        //     unitNumber: unit?.number || '',
        //     unitType: unit?.type || '',
        //     unitBlock: unit?.block || '',
        //     name: `${user?.firstName} ${user?.lastName}`,
        //   },
        // });
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
        throw new BadRequestException(error.message);
      });
  }
}
