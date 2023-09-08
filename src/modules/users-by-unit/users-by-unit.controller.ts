import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersByUnitService } from './users-by-unit.service';
import { CreateUsersByUnitDto } from './dto/create-users-by-unit.dto';
import { UpdateUsersByUnitDto } from './dto/update-users-by-unit.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';

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

  // @Get(':get-by-user/:_id')
  // findByUserId(@ConvertToObjectId() _id: Types.ObjectId) {
  //   return this.usersByUnitService.findOne(_id);
  // }

  @Get(':_id')
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
