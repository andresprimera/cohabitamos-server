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
import { ConvertParamToObjectId } from 'src/decorators/convert-to-objectId.decorator';

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

  //TODO: update to bring every user for a specific unit
  // @Get()
  // findAll() {
  //   return this.usersByUnitService.findAll();
  // }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.usersByUnitService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @Param('_id') _id: string,
    @Body() updateUsersByUnitDto: UpdateUsersByUnitDto,
  ) {
    return this.usersByUnitService.update(_id, updateUsersByUnitDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.usersByUnitService.remove(_id);
  }
}
