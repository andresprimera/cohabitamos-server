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
    operator: string | undefined,
    email: string | undefined,
  ) {
    const { userId, unitId } = createUserRegistrationLinkDto;
    const unit = await this.unitService.findOne(unitId);
    let user = null;
    let operatorUser = null;

    if (userId) {
      user = await this.userService.findOne(userId);
    }

    if (operator) {
      operatorUser = await this.userService.findOne(
        new Types.ObjectId(operator),
      );
    }

    const response = await this.userRegistrationLinkRepository
      .create({ unit, createdBy: operatorUser, ...(email && { email }) })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    return { user, response };
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

  async findByUnit(_id: Types.ObjectId) {
    const response = await this.userRegistrationLinkRepository
      .find({
        'unit._id': _id,
        used: false,
      })
      .sort({ createdAt: -1 })
      .catch((error) => {
        Logger.error(error);
        throw new BadRequestException(error.message);
      });

    const responseObject: {
      message: string;
      linkObject: UserRegistrationLinkEntity | null;
    } = {
      message: 'No se encontraron links para la unidad indicada',
      linkObject: null,
    };

    if (response.length > 0) {
      const { createdAt, expirationTime } = response[0];

      responseObject.message = 'Link cargado con éxito';
      responseObject.linkObject = response[0];

      if (new Date().getTime() > createdAt.getTime() + expirationTime) {
        responseObject.message =
          'El link ha expirado. Contacte a la administración para solicitar otro.';
        responseObject.linkObject = null;
      }

      return responseObject;
    }

    return responseObject;
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
