import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';
import { GetUserInterceptor } from 'src/interceptors/getUser.interceptor';
import { UserEntity } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['account', 'unit', 'condominium'])
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @UseInterceptors(CondominiumInterceptor)
  @UseInterceptors(FileInterceptor('file', { dest: 'temp/' }))
  @Post('create-by-file-upload')
  createByFileUpload(
    @UploadedFile() file: any,
    @Param('requestCondominium') requestCondominium: Types.ObjectId,
  ) {
    return this.usersService.createByFileUpload(file, requestCondominium);
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
