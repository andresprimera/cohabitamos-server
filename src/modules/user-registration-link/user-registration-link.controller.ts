import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserRegistrationLinkService } from './user-registration-link.service';
import { CreateUserRegistrationLinkDto } from './dto/create-user-registration-link.dto';
import { Types } from 'mongoose';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { GetUserInterceptor } from 'src/interceptors/getUser.interceptor';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserRegistrationLinkDto } from './dto/update-user-registration-link.dto';

@Controller('user-registration-link')
export class UserRegistrationLinkController {
  constructor(
    private readonly userRegistrationLinkService: UserRegistrationLinkService,
  ) {}

  @Post()
  create(
    @ConvertParamToObjectId(['unitId', 'userId'])
    createUserRegistrationLinkDto: CreateUserRegistrationLinkDto,
    @Param('operator') operator: string | undefined,
    @Body('email') email: string | undefined,
  ) {
    return this.userRegistrationLinkService.create(
      createUserRegistrationLinkDto,
      operator,
      email,
    );
  }

  @Get('/get-by-unit/:_id')
  findByUnit(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.userRegistrationLinkService.findByUnit(_id);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.userRegistrationLinkService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() _id: Types.ObjectId,
    @ConvertParamToObjectId(['newUserId'])
    updateUserRegistrationLinkDto: UpdateUserRegistrationLinkDto,
  ) {
    return this.userRegistrationLinkService.update(
      _id,
      updateUserRegistrationLinkDto,
    );
  }
}
