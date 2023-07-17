import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserRegistrationLinkEntity } from 'src/entities/user-registration-link.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UnitsService } from '../units/units.service';
import { UsersService } from '../users/users.service';
import { CreateUserRegistrationLinkDto } from './dto/create-user-registration-link.dto';
import { UpdateUserRegistrationLinkDto } from './dto/update-user-registration-link.dto';

@Injectable()
export class UserRegistrationLinkService {
  constructor(
    @InjectModel(UserRegistrationLinkEntity)
    private readonly userRegistrationLinkRepository: ReturnModelType<
      typeof UserRegistrationLinkEntity
    >,
    private readonly unitService: UnitsService,
    private readonly userService: UsersService,
  ) {}

  async create(
    createUserRegistrationLinkDto: CreateUserRegistrationLinkDto,
    operator: UserEntity,
  ) {
    const unit = await this.unitService.findOne(
      createUserRegistrationLinkDto.unitId,
    );

    return this.userRegistrationLinkRepository
      .create({ unit, createdBy: operator })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });
  }

  async findOne(_id: Types.ObjectId) {
    const response = await this.userRegistrationLinkRepository
      .findOne({ _id })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    if (!response)
      throw new BadRequestException('User registration link not found');

    if (response.used)
      throw new BadRequestException(
        'Link de creación de usuario usado. Contacte a la administración para solicitar otro.',
      );

    const { createdAt, expirationTime } = response;

    if (new Date().getTime() > createdAt.getTime() + expirationTime)
      throw new BadRequestException(
        'El link ha expirado. Contacte a la administración para solicitar otro.',
      );

    return response;
  }

  async update(
    _id: Types.ObjectId,
    updateUserRegistrationLinkDto: UpdateUserRegistrationLinkDto,
  ) {
    const newUser = await this.userService.findOne(
      updateUserRegistrationLinkDto.newUserId,
    );

    if (!newUser)
      throw new BadRequestException('No user found for the provided _id');

    return await this.userRegistrationLinkRepository.updateOne(
      { _id },
      { used: true, createdUserId: newUser._id },
    );
  }
}
