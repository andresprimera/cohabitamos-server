import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@ConvertParamToObjectId(['account']) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':_id')
  findOne(@ConvertToObjectId('_id') _id: Types.ObjectId) {
    return this.usersService.findOne(_id);
  }

  @Get('get-by-email/:email')
  findByEmail(@Param('email') email: string) {
    console.log({ email });
    return this.usersService.findByEmail(email);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId('_id') _id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(_id, updateUserDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId('_id') _id: Types.ObjectId) {
    return this.usersService.remove(_id);
  }
}
