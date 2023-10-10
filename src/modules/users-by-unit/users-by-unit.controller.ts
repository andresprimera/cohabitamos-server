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
import { UsersByUnitService } from './users-by-unit.service';
import { CreateUsersByUnitDto } from './dto/create-users-by-unit.dto';
import { UpdateUsersByUnitDto } from './dto/update-users-by-unit.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';
import { GetUserInterceptor } from 'src/interceptors/getUser.interceptor';
import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';

@Controller('users-by-unit')
export class UsersByUnitController {
  constructor(private readonly usersByUnitService: UsersByUnitService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['unit', 'user'])
    createUsersByUnitDto: CreateUsersByUnitDto,
  ) {
    return this.usersByUnitService.create(createUsersByUnitDto);
  }

  @UseInterceptors(CondominiumInterceptor)
  @Get('pending-auth')
  findAuthPending(
    @Param('requestCondominium') requestCondominium: Types.ObjectId,
  ) {
    return this.usersByUnitService.findAuthPending(requestCondominium);
  }

  @Get('unit-id/:_id')
  find(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.usersByUnitService.find(_id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() _id: Types.ObjectId,
    @Body() updateUsersByUnitDto: UpdateUsersByUnitDto,
  ) {
    return this.usersByUnitService.update(_id, updateUsersByUnitDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.usersByUnitService.remove(_id);
  }
}
