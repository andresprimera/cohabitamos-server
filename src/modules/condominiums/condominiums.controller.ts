import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CondominiumsService } from './condominiums.service';
import { CreateCondominiumDto } from './dto/create-condominium.dto';
import { UpdateCondominiumDto } from './dto/update-condominium.dto';
import {
  ConvertParamToObjectId,
  ConvertToObjectId,
} from 'src/decorators/convert-to-objectId.decorator';
import { Types } from 'mongoose';
import { UserEntity } from 'src/entities/user.entity';
import { GetUserInterceptor } from 'src/interceptors/getUser.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('condominiums')
export class CondominiumsController {
  constructor(private readonly condominiumsService: CondominiumsService) {}

  @Post()
  create(
    @ConvertParamToObjectId(['account'])
    createCondominiumDto: CreateCondominiumDto,
  ) {
    return this.condominiumsService.create(createCondominiumDto);
  }

  @UseInterceptors(GetUserInterceptor)
  @UseInterceptors(FileInterceptor('file', { dest: 'temp/' }))
  @Post('create-by-file-upload')
  createByFileUpload(
    @UploadedFile() file: any,
    @Param('operator') operator: UserEntity,
  ) {
    return this.condominiumsService.createByFileUpload(file, operator);
  }

  @UseInterceptors(GetUserInterceptor)
  @Get()
  findAll(@Param('operator') operator: UserEntity) {
    return this.condominiumsService.findAll(operator);
  }

  @Get(':_id')
  findOne(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.condominiumsService.findOne(_id);
  }

  @Patch(':_id')
  update(
    @ConvertToObjectId() _id: Types.ObjectId,
    @Body() updateCondominiumDto: UpdateCondominiumDto,
  ) {
    return this.condominiumsService.update(_id, updateCondominiumDto);
  }

  @Delete(':_id')
  remove(@ConvertToObjectId() _id: Types.ObjectId) {
    return this.condominiumsService.remove(_id);
  }
}
