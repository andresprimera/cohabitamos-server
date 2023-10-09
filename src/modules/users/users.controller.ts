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
import { UsersService } from './users.service';
import { CreateUserDto } from '../../common/dtos/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';

import * as path from 'path';

import { CondominiumInterceptor } from 'src/interceptors/captureCondominium.interceptor';
import { createWriteStream } from 'fs';
import { GetUserInterceptor } from 'src/interceptors/getUser.interceptor';
import { UserEntity } from 'src/entities/user.entity';

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
  @Post('create-by-file-upload')
  createByFileUpload(
    // @UploadedFile() file: any,
    @Param('requestCondominium') requestCondominium: Types.ObjectId,
    @Body() body: { file: string },
  ) {
    // Decode the base64 string to a buffer
    const fileBuffer = Buffer.from(body.file, 'base64');

    // Write the buffer to a file (you can modify the path and filename as needed)
    const filePath = path.join(__dirname, './', 'usersFile.txt');

    const writeStream = createWriteStream(filePath);
    writeStream.write(fileBuffer);
    writeStream.end();
    return this.usersService.createByFileUpload(filePath, requestCondominium);
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
    return this.usersService.findUserByEmail(email);
  }

  @UseInterceptors(GetUserInterceptor)
  @Post('get-operators-by-account')
  getOperatorsByAccount(@Param('operator') operator: UserEntity) {
    return this.usersService.getOperatorsByAccount(operator._id);
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
