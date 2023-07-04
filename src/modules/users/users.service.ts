import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserEntity } from '../../entities/user.entity';
import { Types } from 'mongoose';
import { UsersByUnitService } from '../users-by-unit/users-by-unit.service';
import { UnitsService } from '../units/units.service';
import { Firebase } from 'src/providers/firebase';
import { AccountsService } from '../accounts/accounts.service';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity)
    private readonly userRepository: ReturnModelType<typeof UserEntity>,
    private readonly unitService: UnitsService,
    private readonly usersByUnitService: UsersByUnitService,
    private readonly firebase: Firebase,
    private readonly accountService: AccountsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let unit = null;

    if (
      createUserDto.role !== 'administrador' &&
      createUserDto.role !== 'superadmin'
    ) {
      unit = this.unitService.findOne(createUserDto.unit);
      if (!unit) {
        throw new NotFoundException(
          'No unit was found for the provided unit _id',
        );
      }
    }

    const auth = this.firebase.getAuth();
    const userRecord = await auth
      .createUser({
        email: createUserDto.email,
        emailVerified: true,
        password: createUserDto?.password || 'qwerty',
        displayName: `${createUserDto.firstName} ${createUserDto.lastName} `,
        disabled: false,
      })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    const newUser = await this.userRepository
      .create({ ...createUserDto, uid: userRecord.uid })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (createUserDto.role !== 'superadmin') {
      if (unit) {
        await this.usersByUnitService.create({
          unit: createUserDto.unit,
          user: newUser._id,
          condition: createUserDto.condition,
        });
      } else {
        await this.accountService.create({
          owner: newUser._id,
          startingDate: new Date(),
          nextBillingDate: new Date(
            new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
          ),
          status: 'Activo',
        });
      }
    }

    return newUser;
  }

  async findAll() {
    //TODO: Pagination
    return await this.userRepository.find().catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.userRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided _id');
    }

    return response;
  }

  async findByUid(uid: string) {
    const response = await this.userRepository
      .findOne({ uid })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided uid');
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
        throw new BadRequestException(error.message);
      });

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
        throw new BadRequestException(error.message);
      });

    if (!response) {
      throw new NotFoundException('No user was found for the provided _id');
    }

    return response;
  }

  async remove(_id: Types.ObjectId) {
    return await this.userRepository.deleteOne({ _id }).catch((error) => {
      Logger.error(error);
      throw new BadRequestException(error.message);
    });
  }
}
